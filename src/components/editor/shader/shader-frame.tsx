'use client';

import * as React from 'react';

import { useImageShader } from './hooks/useImageShader';

export const ShaderFrame = () => {
	const { register } = useImageShader();

	return (
		<div className='flex items-center justify-center'>
			<canvas {...register()}>Your browser does not support the HTML5 canvas tag.</canvas>
		</div>
	);
};
