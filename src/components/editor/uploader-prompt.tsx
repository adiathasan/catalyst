'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Icons } from '../global/icons';
import { siteConfig } from '@/config/site-config';
import { UploadButton } from './upload-button';
import { usePromptDialog } from '@/store/hooks/usePromptDialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

export const UploaderPrompt = () => {
	const { promptDialogOpen } = usePromptDialog();

	return (
		<div className={promptDialogOpen ? cn('fixed inset-0 z-30 bg-background/80 backdrop-blur-sm') : 'opacity-0'}>
			<Dialog modal open={promptDialogOpen}>
				<DialogContent
					onEscapeKeyDown={(e) => {
						e.preventDefault();
					}}>
					<DialogHeader className='p-4 bg-slate-800'>
						<DialogTitle className='flex items-center space-x-2 tracking-widest'>
							<Icons.logo className='w-6 h-6' />

							<span>{siteConfig.siteName}</span>
						</DialogTitle>
					</DialogHeader>
					<DialogDescription className='flex items-center gap-6 mt-4'>
						<span>Please Select to Continue</span>
						<UploadButton />
					</DialogDescription>
				</DialogContent>
			</Dialog>
		</div>
	);
};
