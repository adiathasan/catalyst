import { useShallow } from 'zustand/react/shallow';

import { useGlobalStore } from '../global-store';

export const useBrightness = () => {
	const { brightness, setBrightness } = useGlobalStore(
		useShallow((state) => ({
			brightness: state.brightness,
			setBrightness: state.setBrightness,
		}))
	);

	return {
		brightness,
		setBrightness,
	};
};
