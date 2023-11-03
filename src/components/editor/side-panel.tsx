'use client';

import * as React from 'react';

import { Slider } from '../ui/slider';
import { useContrast } from '@/store/hooks/useContrast';
import { useExposure } from '@/store/hooks/useExposure';
import { useBrightness } from '@/store/hooks/useBrightness';

export function SidePanel() {
	const { brightness, setBrightness } = useBrightness();

	const { contrast, setContrast } = useContrast();

	const { exposure, setExposure } = useExposure();

	return (
		<div className='space-y-4'>
			<div className='pb-6 space-y-4 border-b'>
				<div className='flex items-center justify-between'>
					<h4 className='text-slate-300'>Brightness</h4>
					<span className='text-base text-slate-400'>{brightness}</span>
				</div>
				<Slider
					step={0.01}
					max={1}
					min={-1}
					value={[brightness]}
					onValueChange={(value) => {
						setBrightness(value[0]);
					}}
				/>
			</div>
			<div className='pb-6 space-y-4 border-b'>
				<div className='flex items-center justify-between'>
					<h4 className='text-slate-300'>Exposure</h4>
					<span className='text-base text-slate-400'>{exposure}</span>
				</div>
				<Slider
					step={0.01}
					max={1}
					min={0}
					value={[exposure]}
					onValueChange={(value) => {
						setExposure(value[0]);
					}}
				/>
			</div>
			<div className='pb-6 space-y-4 border-b'>
				<div className='flex items-center justify-between'>
					<h4 className='text-slate-300'>Contrast</h4>
					<span className='text-base text-slate-400'>{contrast}</span>
				</div>
				<Slider
					step={0.01}
					max={1}
					min={-1}
					value={[contrast]}
					onValueChange={(value) => {
						setContrast(value[0]);
					}}
				/>
			</div>
		</div>
	);
}
