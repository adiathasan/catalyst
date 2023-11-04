import { useShallow } from 'zustand/react/shallow';

import { useGlobalStore } from '@/store/global-store';

export const useCanvasReactor = () => {
	const { setCanvas, textureHeight, textureWidth } = useGlobalStore(
		useShallow((state) => ({
			setCanvas: state.setCanvas,
			textureWidth: state.mainTexture ? state.mainTexture.width : 500,
			textureHeight: state.mainTexture ? state.mainTexture.height : 500,
		}))
	);

	return {
		register: () => {
			return {
				width: textureWidth,
				height: textureHeight,
				ref: (canvas: HTMLCanvasElement) => {
					setCanvas(canvas);

					return canvas;
				},
			};
		},
	};
};
