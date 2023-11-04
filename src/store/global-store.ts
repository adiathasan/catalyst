import { create } from 'zustand';

import {
	brightnessContrast,
	exposure,
	textureShader,
} from '@/components/editor/shader/glsl/image-filter-fragment-shaders';
import { createFrameBuffer, createShaderProgramFromSource, resizeCanvasToDisplaySize } from '@/lib/webgl/webgl-utils';
import { WebGL } from '@/lib/webgl/webgl-types';

export const fragmentShaders = [textureShader, brightnessContrast, exposure];

/**
 * This is the default vertex shader used for all fragment shaders.
 * It maps the [-1, 1] coord space to [0, 1] for the fragment shader.
 */
const defaultVertexShader = `
	attribute vec2 a_position;
	attribute vec2 a_texCoord;

	varying vec2 v_position;
	varying vec2 v_texCoord;

	void main() {
		v_texCoord = a_texCoord;
		// map coord space from [-1, 1] -> [0, 1]
		v_position = (a_position + 1.) / 2.;
		gl_Position = vec4(a_position.x, a_position.y, 0.0, 1.0);
	}
`;

export interface AppStore {
	/**
	 * The prompt dialog state
	 */
	promptDialogOpen: boolean;
	setPromptDialogOpen: (value: boolean) => void;

	/**
	 * The file that is currently being edited
	 */
	file: File | null;
	setFile: (value: File | null, texture: HTMLImageElement) => void;
	mainTexture: HTMLImageElement | null;

	/**
	 * Image manipulation values
	 */
	brightness: number;
	setBrightness: (value: number) => void;
	exposure: number;
	setExposure: (value: number) => void;
	contrast: number;
	setContrast: (value: number) => void;

	/**
	 * The current shader program
	 */
	webGlError?: string;
	throwGlError: (message?: string) => void;
	canvas?: HTMLCanvasElement;
	setCanvas: (value: HTMLCanvasElement) => void;
	gl?: WebGL;
	startGlTexture: WebGLTexture | null;
	getUniformValues: () => any[];
	shaderOnMount: () => void;
	render: () => void;
	onAttributeChange: () => void;
}

export const useGlobalStore = create<AppStore>()((set, get) => ({
	// --- Prompt dialog ---
	promptDialogOpen: false,
	setPromptDialogOpen: (value) => set({ promptDialogOpen: value }),

	// --- File ---
	file: null,
	setFile: (value, texture) => {
		set({ file: value, promptDialogOpen: false, mainTexture: texture });
		/**
		 * Hack to pull the onAttributeChange call out of the current call stack
		 * so that the canvas is ready to be rendered when all the Fns are executed
		 */
		setTimeout(() => {
			get().onAttributeChange();
		});
	},
	mainTexture: null,

	// --- Image manipulation values ---
	brightness: 0,
	setBrightness: (value) => {
		set({ brightness: value });
		get().onAttributeChange();
	},
	exposure: 0,
	setExposure: (value) => {
		set({ exposure: value });
		get().onAttributeChange();
	},
	contrast: 0,
	setContrast: (value) => {
		set({ contrast: value });
		get().onAttributeChange();
	},

	// --- Shader program methods ---
	startGlTexture: null,
	setCanvas(value) {
		set({ canvas: value });
		get().shaderOnMount();
	},
	getUniformValues() {
		const { brightness, contrast, exposure } = get();

		return [
			null, // texture
			{ brightness, contrast },
			{ exposure },
		];
	},
	throwGlError(error: string = 'Something went wrong') {
		set({ webGlError: error });
	},
	shaderOnMount() {
		const canvas = get().canvas;

		if (!canvas) {
			return;
		}

		const throwGlError = get().throwGlError;

		if (!canvas) {
			return throwGlError();
		}

		const gl = canvas.getContext('webgl');

		if (!gl) {
			return throwGlError();
		}

		const texture = get().mainTexture;

		const width = texture?.width ?? 500;
		const height = texture?.height ?? 500;

		let currentFrameBufferObject = createFrameBuffer(gl, width, height);
		let previousFrameBufferObject = createFrameBuffer(gl, width, height);

		// Define a surface quad to draw stuff on. It will cover the entire canvas draw area.
		const positionVerts = [-1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0];
		const textureCoords = [0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];

		const positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionVerts), gl.STATIC_DRAW);

		// Map the corners of the texture to our quad.
		const textureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);

		gl.viewport(0, 0, width, height);
		gl.clearColor(0, 0, 0, 1.0);

		const numVerts = positionVerts.length / 2;

		const prepareRenderPass = (shaderProgram: WebGLProgram, uniformsObj: any) => {
			gl.useProgram(shaderProgram);

			const positionAttrLocation = gl.getAttribLocation(shaderProgram, 'a_position');

			if (positionAttrLocation !== null) {
				gl.enableVertexAttribArray(positionAttrLocation);

				gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

				// Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
				gl.vertexAttribPointer(
					positionAttrLocation,
					2, // size (2 floats per vertex)
					gl.FLOAT, // type (32bit floats)
					false, // normalize
					0, // stride (bytes per vertex, ignored if 0)
					0 // offset (byte offset in stride to read data, ignored if 0)
				);
			}

			const textureCoordAttrLocation = gl.getAttribLocation(shaderProgram, 'a_texCoord');

			if (textureCoordAttrLocation !== null) {
				// Turn on the texcoord attribute
				gl.enableVertexAttribArray(textureCoordAttrLocation);

				// bind the texcoord buffer.
				gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

				// Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
				// location, size, type, normalize, stride, offset
				gl.vertexAttribPointer(textureCoordAttrLocation, 2, gl.FLOAT, false, 0, 0);
			}

			const resolutionUniformLocation = gl.getUniformLocation(shaderProgram, 'u_resolution');
			if (resolutionUniformLocation !== null) {
				gl.uniform2f(resolutionUniformLocation, width, height);
			}

			const textureSizeUniformLocation = gl.getUniformLocation(shaderProgram, 'u_texSize');
			if (textureSizeUniformLocation !== null && texture) {
				// set the size of the image
				gl.uniform2f(textureSizeUniformLocation, texture.width, texture.height);
			}

			const timeUniformLocation = gl.getUniformLocation(shaderProgram, 'u_time');
			if (timeUniformLocation !== null) {
				gl.uniform1f(timeUniformLocation, Date.now() / 1000);
			}

			if (uniformsObj) {
				const uniformsKeys = Object.keys(uniformsObj);

				for (let t = 0, len = uniformsKeys.length; t < len; t++) {
					const uniformName = uniformsKeys[t];
					const uniformLocation = gl.getUniformLocation(shaderProgram, uniformName);

					if (uniformLocation !== null) {
						gl.uniform1f(uniformLocation, uniformsObj[uniformName]);
					}
				}
			}
		};

		const render = () => {
			const uniformValues = get().getUniformValues();

			const shaderPrograms = fragmentShaders.map((fragmentShader) =>
				createShaderProgramFromSource(gl, defaultVertexShader, fragmentShader)
			);

			if (!shaderPrograms) {
				return throwGlError();
			}

			resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);

			// clear canvas
			gl.clear(gl.COLOR_BUFFER_BIT);

			if (get().startGlTexture) {
				gl.bindTexture(gl.TEXTURE_2D, get().startGlTexture);
			}

			const numShaderPrograms = shaderPrograms.length;

			for (let x = 0, len = numShaderPrograms - 1; x < len; x++) {
				const shaderProgram = shaderPrograms[x];
				const _uniforms = uniformValues[x];

				prepareRenderPass(shaderProgram, _uniforms);

				// drawing to an internal texture as part of a multi-pass render pipeline
				gl.bindFramebuffer(gl.FRAMEBUFFER, currentFrameBufferObject.frameBuffer);
				// draw with current shader (prim type, offset, num verts)
				gl.drawArrays(gl.TRIANGLES, 0, numVerts);
				// set the current texture to the result so the next shader can pick it up
				gl.bindTexture(gl.TEXTURE_2D, currentFrameBufferObject.texture);
				// swap the buffers.
				const temp = currentFrameBufferObject;
				currentFrameBufferObject = previousFrameBufferObject;
				previousFrameBufferObject = temp;
			}

			prepareRenderPass(shaderPrograms[numShaderPrograms - 1], uniformValues[numShaderPrograms - 1]);

			// finally draw to the screen
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			gl.drawArrays(gl.TRIANGLES, 0, numVerts);
		};

		/**
		 * Render method
		 */
		set({
			render,
			gl,
		});
	},
	onAttributeChange() {
		const { gl, render } = get();

		const throwGlError = get().throwGlError;

		if (!gl) {
			return throwGlError();
		}

		const glTexture = gl.createTexture();

		gl.bindTexture(gl.TEXTURE_2D, glTexture);

		// Set the parameters so we can render any size image.
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

		const texture = get().mainTexture;

		if (!texture) {
			return throwGlError();
		}

		// flip y-axis of textures because html canvas 0,0 is not the same as opengl 0,0
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

		// Upload the image into the texture.
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture);

		if (glTexture) {
			set({
				startGlTexture: glTexture,
			});
		}

		render();
	},

	/**
	 * Render method is empty by default
	 * It will be set in the shaderOnMount method
	 */
	render() {},
}));
