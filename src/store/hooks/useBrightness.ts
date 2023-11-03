import * as React from 'react';

import { useGlobalStore } from '../global-store';

export const useBrightness = () => {
	const { brightness, setBrightness } = useGlobalStore((state) => ({
		brightness: state.brightness,
		setBrightness: state.setBrightness,
	}));

	return {
		brightness,
		setBrightness,
	};
};
