import { useGlobalStore } from '../global-store';

export const useFileProcessor = () => {
	const { file, setFile, mainTexture } = useGlobalStore((state) => ({
		file: state.file,
		setFile: state.setFile,
		mainTexture: state.mainTexture,
	}));

	return {
		file,
		setFile,
		mainTexture,
	};
};
