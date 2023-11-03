import * as React from 'react';

import { useGlobalStore } from '../global-store';

export const useExposure = () => {
	const { exposure, setExposure } = useGlobalStore((state) => ({
		exposure: state.exposure,
		setExposure: state.setExposure,
	}));

	return {
		exposure,
		setExposure,
	};
};
