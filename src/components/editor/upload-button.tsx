import * as React from 'react';

import { cn } from '@/lib/utils';
import { Icons } from '../global/icons';
import { useFileUpload } from '@/store/hooks/useFileUpload';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export const UploadButton = () => {
	const { handleFileChange, imageLoading } = useFileUpload();

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<button
						tabIndex={-1}
						className={cn(
							'transition-colors font-mono border border-primary py-1 px-2 rounded text-primary/70 hover:text-primary/80 flex items-center space-x-1'
						)}>
						{imageLoading ? <Icons.spinner className='w-4 h-4' /> : <Icons.upload className='w-4 h-4' />}

						<span>Import</span>
						<input
							onChange={handleFileChange}
							tabIndex={0}
							accept='
							image/png,
							image/jpeg,
						'
							type='file'
							className='absolute inset-0 opacity-0 cursor-pointer'
						/>
					</button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Select a file to open in the editor.</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
