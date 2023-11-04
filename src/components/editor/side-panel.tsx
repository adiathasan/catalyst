'use client';

import * as React from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Icons } from '../global/icons';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { siteConfig } from '@/config/site-config';
import { useContrast } from '@/store/hooks/useContrast';
import { useExposure } from '@/store/hooks/useExposure';
import { useFileStore } from '@/store/hooks/useFileStore';
import { downloadBlob } from '@/lib/utils';
import { useBrightness } from '@/store/hooks/useBrightness';
import { useGlobalStore } from '@/store/global-store';

export function SidePanel() {
	const { canvas, render } = useGlobalStore(
		useShallow((state) => ({
			canvas: state.canvas,
			render: state.render,
		}))
	);

	const [isLoading, setIsLoading] = React.useState(false);

	const { file } = useFileStore();

	const { toast } = useToast();

	const downloadImage = () => {
		const triggerError = () => {
			toast({
				title: 'No image to download',
				variant: 'destructive',
			});
		};

		if (!canvas || !file) {
			triggerError();
			return;
		}

		setIsLoading(true);

		/**
		 * Render before downloading
		 * If rendering is not done, it will download a blank image
		 * @see https://webglfundamentals.org/webgl/lessons/webgl-tips.html
		 */
		render();

		canvas.toBlob((blob) => {
			if (!blob) {
				triggerError();
				setIsLoading(false);
				return;
			}

			setIsLoading(false);
			downloadBlob(blob, `${siteConfig.siteName}-${file.name}`);
		});
	};

	return (
		<div className='flex flex-col gap-8'>
			<Brightness />
			<Contrast />
			<Exposure />
			<section className='py-4 mt-auto'>
				<Button
					onClick={downloadImage}
					size='sm'
					variant='outline'
					className='flex items-center gap-2 mx-auto text-primary/70 border-primary/70'>
					{isLoading ? <Icons.spinner className='w-4 h-4 mr-2' /> : <Icons.download className='w-4 h-4 mr-2' />}
					<span>Download</span>
				</Button>
			</section>
		</div>
	);
}

/**
 * Separated components for each slider because it can prevent unnecessary re-renders
 * And use it anywhere in the app
 */
export const Brightness = () => {
	const { brightness, setBrightness } = useBrightness();

	return (
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
	);
};

export const Contrast = () => {
	const { contrast, setContrast } = useContrast();

	return (
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
	);
};

export const Exposure = () => {
	const { exposure, setExposure } = useExposure();

	return (
		<div className='pb-6 space-y-4 border-b'>
			<div className='flex items-center justify-between'>
				<h4 className='text-slate-300'>Exposure</h4>
				<span className='text-base text-slate-400'>{exposure}</span>
			</div>
			<Slider
				step={0.01}
				max={1}
				min={-1}
				value={[exposure]}
				onValueChange={(value) => {
					setExposure(value[0]);
				}}
			/>
		</div>
	);
};
