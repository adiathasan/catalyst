'use client';

import * as React from 'react';

import { useCanvasReactor } from './hooks/useCanvasReactor';

export const ShaderFrame = () => {
	const { register } = useCanvasReactor();

	return (
		<canvas className='mx-auto' {...register()}>
			Your browser does not support the HTML5 canvas tag.
		</canvas>
	);
};
