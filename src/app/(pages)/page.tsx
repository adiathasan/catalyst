import { cn } from '@/lib/utils';
import { SidePanel } from '@/components/editor/side-panel';
import { ShaderFrame } from '@/components/editor/shader/shader-frame';

export default function Home() {
	return (
		<main className='flex h-ful'>
			<section className={cn('w-[calc(100vw-24rem)] h-[calc(100vh-28px)] p-4 overflow-auto bg-slate-950')}>
				<ShaderFrame />
			</section>
			<section className='fixed right-0 h-full p-4 w-96 bg-slate-900'>
				<SidePanel />
			</section>
		</main>
	);
}
