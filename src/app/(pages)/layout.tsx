import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { siteConfig } from '@/config/site-config';
import { ThemeProvider } from '@/components/global/theme-provider';

import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: siteConfig.siteName,
	description: siteConfig.siteDescription,
	openGraph: {
		title: siteConfig.siteName,
		description: siteConfig.siteDescription,
		type: 'website',
		siteName: siteConfig.siteName,
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head />
			<body className={cn(inter.className, 'relative flex min-h-screen flex-col')}>
				<ThemeProvider attribute='class' defaultTheme='dark'>
					<Toaster />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
