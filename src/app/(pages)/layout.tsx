import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { ThemeProvider } from '@/components/global/theme-provider';

import '../globals.css';
import { cn } from '@/lib/utils';
import { MainNav } from '@/components/global/main-nav';
import { Toaster } from '@/components/ui/toaster';
import { siteConfig } from '@/config/site-config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: siteConfig.siteName,
	description: siteConfig.siteDescription,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head />
			<body className={cn(inter.className, 'relative flex min-h-screen flex-col')}>
				<ThemeProvider attribute='class' defaultTheme='dark' enableSystem disableTransitionOnChange>
					<MainNav />
					<Toaster />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
