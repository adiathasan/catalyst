export const textureShader = `
	precision mediump float;

	// our texture (first bound texture)
	uniform sampler2D texture;

	// the texCoords passed in from the vertex shader.
	varying vec2 v_texCoord;

	void main() {
		gl_FragColor = texture2D(texture, v_texCoord);
	}
`;

export const brightnessContrast = `
  precision mediump float;

  uniform sampler2D texture;
  uniform float brightness;
  uniform float contrast;

  varying vec2 v_texCoord;

  void main() {
    vec4 texColor = texture2D(texture, v_texCoord);
    texColor.rgb += brightness;
    if (contrast > 0.0) {
        texColor.rgb = (texColor.rgb - 0.5) / (1.0 - contrast) + 0.5;
    } else {
        texColor.rgb = (texColor.rgb - 0.5) * (1.0 + contrast) + 0.5;
    }
    gl_FragColor = vec4(texColor.rgb, 1.0);
  }
`;

// maybe this would work better? untested: https://learnopengl.com/Advanced-Lighting/HDR
export const exposure = `
    precision mediump float;

    uniform sampler2D texture;
    uniform float exposure;

    varying vec2 v_texCoord;

    void main() {
        vec4 color = texture2D(texture, v_texCoord);
        gl_FragColor = vec4(color.rgb * pow(2.0, exposure), color.a);
    }
`;
