import * as React from 'react';

import { useGlobalStore } from '../global-store';

export const useContrast = () => {
	const { contrast, setContrast } = useGlobalStore((state) => ({
		contrast: state.contrast,
		setContrast: state.setContrast,
	}));

	return {
		contrast,
		setContrast,
	};
};
