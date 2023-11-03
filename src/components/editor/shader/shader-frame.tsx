'use client';

import * as React from 'react';
import { UploaderPrompt } from '../uploader-prompt';

export const ShaderFrame = () => {
	return (
		<div className='w-full h-5/6'>
			<h1>Shader Frame</h1>
			<UploaderPrompt />
		</div>
	);
};
