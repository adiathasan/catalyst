'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Icons } from '../global/icons';
import { siteConfig } from '@/config/site-config';
import { UploadButton } from './upload-button';
import { usePromptDialog } from '@/store/hooks/usePromptDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

export const UploaderPrompt = () => {
	const { promptDialogOpen, setPromptDialogOpen } = usePromptDialog();

	/**
	 * Had to do this hack because Next - 14 / Server Component was complaining about
	 * Error: Hydration failed because the initial UI...
	 * @see https://github.com/vercel/next.js/discussions/35773
	 */
	React.useEffect(() => {
		setPromptDialogOpen(true);
	}, [setPromptDialogOpen]);

	return (
		<div className={promptDialogOpen ? cn('fixed inset-0 z-30 bg-background/80 backdrop-blur-sm') : 'opacity-0'}>
			<Dialog modal open={promptDialogOpen}>
				<DialogContent
					onEscapeKeyDown={(e) => {
						e.preventDefault();
					}}>
					<DialogHeader className='p-4 bg-slate-800'>
						<DialogTitle className='flex items-center gap-2 tracking-widest'>
							<Icons.logo className='w-6 h-6' />

							<span>{siteConfig.siteName}</span>
						</DialogTitle>
						<p className='text-sm tracking-widest text-slate-400'>{siteConfig.siteDescription}</p>
					</DialogHeader>
					<div className='flex items-center gap-6 mt-4'>
						<span className='font-mono text-primary/60'>Please Select to Continue</span>
						<UploadButton />
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};
