'use client';

import * as React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Icons } from '@/components/global/icons';
import { siteConfig } from '@/config/site-config';
import { UploadButton } from '../editor/upload-button';

export function MainNav() {
	return (
		<nav className='sticky top-0 z-40 w-full p-4 border-b border-slate-800 bg-slate-900'>
			<div className='flex mr-4'>
				<Link href='/' className='flex items-center mr-6 space-x-2'>
					<Icons.logo className='w-6 h-6' />
					<span className='hidden font-mono tracking-wider sm:inline-block'>
						{siteConfig.siteName} <sup className='p-1 text-xs font-thin border rounded'>Alpha</sup>
					</span>
				</Link>
				<nav className='flex items-center flex-1 gap-4 text-sm font-medium'>
					<span className='relative'>
						<UploadButton />
					</span>

					<Link
						referrerPolicy='no-referrer'
						rel='noopener noreferrer'
						target='_blank'
						href={siteConfig.links.github}
						className={cn('ml-auto text-foreground/60 transition-colors hover:text-primary/80')}>
						<Icons.gitHub className='w-6 h-6' />
					</Link>
				</nav>
			</div>
		</nav>
	);
}
