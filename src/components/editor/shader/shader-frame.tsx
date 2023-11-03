'use client';

import * as React from 'react';

import { useImageShader } from './hooks/useImageShader';

export const ShaderFrame = () => {
	const { register } = useImageShader();

	return (
		<canvas className='mx-auto' {...register()}>
			Your browser does not support the HTML5 canvas tag.
		</canvas>
	);
};
