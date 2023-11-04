'use client';

import * as React from 'react';

import { Icons } from '../global/icons';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { useShallow } from 'zustand/react/shallow';
import { siteConfig } from '@/config/site-config';
import { downloadBlob } from '@/lib/utils';
import { useFileStore } from '@/store/hooks/useFileStore';
import { useGlobalStore } from '@/store/global-store';
import { Slider } from '../ui/slider';

export const DownloadImage = () => {
	const { canvas, render, quality, setQuality } = useGlobalStore(
		useShallow((state) => ({
			canvas: state.canvas,
			render: state.render,
			quality: state.quality,
			setQuality: state.setQuality,
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

		canvas.toBlob(
			(blob) => {
				if (!blob) {
					triggerError();
					setIsLoading(false);
					return;
				}

				setIsLoading(false);
				downloadBlob(blob, `${siteConfig.siteName}-${file.name}`);
			},
			file.type,
			quality
		);
	};
	return (
		<div className='flex flex-col gap-4 p-4 border rounded'>
			<div className='pb-6 space-y-4 border-b'>
				<div className='flex items-center justify-between'>
					<h4 className='text-slate-300'>
						Quality <span className='font-mono text-slate-400'>(Jpeg)</span>
					</h4>
					<span className='text-base text-slate-400'>{quality}</span>
				</div>
				<Slider
					step={0.05}
					max={1}
					min={0}
					value={[quality]}
					onValueChange={(value) => {
						setQuality(value[0]);
					}}
				/>
			</div>
			<Button
				onClick={downloadImage}
				size='sm'
				variant='outline'
				className='flex items-center gap-2 mx-auto text-primary/70 border-primary/70'>
				{isLoading ? <Icons.spinner className='w-4 h-4 mr-2' /> : <Icons.download className='w-4 h-4 mr-2' />}
				<span>Download</span>
			</Button>
		</div>
	);
};
