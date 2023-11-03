import { useShallow } from 'zustand/react/shallow';

import { useGlobalStore } from '../global-store';

export const useExposure = () => {
	const { exposure, setExposure } = useGlobalStore(
		useShallow((state) => ({
			exposure: state.exposure,
			setExposure: state.setExposure,
		}))
	);

	return {
		exposure,
		setExposure,
	};
};
