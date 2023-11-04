import { WebGL } from './webgl-types';

export const createShader = (gl: WebGL, shaderSource: string, shaderType: number) => {
	const shader = gl.createShader(shaderType);

	if (!shader) {
		throw new Error('could not create shader');
	}

	gl.shaderSource(shader, shaderSource);

	gl.compileShader(shader);

	const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (!success) {
		throw new Error('could not compile shader:' + gl.getShaderInfoLog(shader));
	}

	return shader;
};

export const createVertexShader = (gl: WebGL, shaderSource: string) => createShader(gl, shaderSource, gl.VERTEX_SHADER);

export const createFragmentShader = (gl: WebGL, shaderSource: string) =>
	createShader(gl, shaderSource, gl.FRAGMENT_SHADER);

export const createShaderProgram = (gl: WebGL, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
	const program = gl.createProgram();

	if (!program) {
		throw new Error('could not create program');
	}

	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);

	gl.linkProgram(program);

	const success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (!success) {
		throw new Error('program failed to link:' + gl.getProgramInfoLog(program));
	}

	return program;
};

export const createShaderProgramFromSource = (gl: WebGL, vertexShaderSrc: string, fragmentShaderSrc: string) => {
	const vertShader = createVertexShader(gl, vertexShaderSrc);
	const fragShader = createFragmentShader(gl, fragmentShaderSrc);
	return createShaderProgram(gl, vertShader, fragShader);
};

export const createFrameBuffer = (gl: WebGL, width: number, height: number) => {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Set up texture so we can render any size image and so we are working with pixels.
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

	let frameBuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

	return {
		frameBuffer,
		texture,
	};
};

export const resizeCanvasToDisplaySize = (canvas: HTMLCanvasElement) => {
	const displayWidth = canvas.clientWidth;
	const displayHeight = canvas.clientHeight;

	// Check if the canvas is not the same size.
	const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;

	if (needResize) {
		// Make the canvas the same size
		canvas.width = displayWidth;
		canvas.height = displayHeight;
	}

	return needResize;
};
