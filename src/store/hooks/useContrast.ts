import { useShallow } from 'zustand/react/shallow';

import { useGlobalStore } from '../global-store';

/**
 * @Note - we can reduce the number of re-renders by using shallow equality check.
 */
export const useContrast = () => {
	const { contrast, setContrast } = useGlobalStore(
		useShallow((state) => ({
			contrast: state.contrast,
			setContrast: state.setContrast,
		}))
	);

	return {
		contrast,
		setContrast,
	};
};
