import { cn } from '@/lib/utils';
import { MainNav } from '@/components/global/main-nav';
import { SidePanel } from '@/components/editor/side-panel';
import { ShaderFrame } from '@/components/editor/shader/shader-frame';
import { UploaderPrompt } from '@/components/editor/uploader-prompt';

export default function Home() {
	return (
		<>
			<MainNav />
			<main className='flex h-full'>
				<UploaderPrompt />
				<section
					className={cn(
						'w-[calc(100vw-11rem)] md:w-[calc(100vw-24rem)] h-[calc(100vh-28px)] p-4 overflow-auto bg-slate-950'
					)}>
					<ShaderFrame />
				</section>
				<section className='fixed right-0 h-full p-4 w-44 md:w-96 bg-slate-900'>
					<SidePanel />
				</section>
			</main>
		</>
	);
}
