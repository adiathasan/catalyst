import { useShallow } from 'zustand/react/shallow';

import { useGlobalStore } from '../global-store';

export const useFileStore = () => {
	const { file, setFile, mainTexture } = useGlobalStore(
		useShallow((state) => ({
			file: state.file,
			setFile: state.setFile,
			mainTexture: state.mainTexture,
		}))
	);

	return {
		file,
		setFile,
		mainTexture,
	};
};
