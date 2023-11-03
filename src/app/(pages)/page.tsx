import { cn } from '@/lib/utils';
import { MainNav } from '@/components/global/main-nav';
import { SidePanel } from '@/components/editor/side-panel';
import { ShaderFrame } from '@/components/editor/shader/shader-frame';
import { UploaderPrompt } from '@/components/editor/uploader-prompt';

export default function Home() {
	return (
		<>
			<UploaderPrompt />
			<MainNav />
			<main className='flex flex-col h-full md:flex-row'>
				<section
					className={cn('w-full md:w-[calc(100vw-24rem)] md:h-[calc(100vh-30px)] p-4 overflow-auto bg-slate-950')}>
					<ShaderFrame />
				</section>
				<section className='right-0 w-full h-full p-4 md:fixed md:w-96 bg-slate-900'>
					<SidePanel />
				</section>
			</main>
		</>
	);
}
