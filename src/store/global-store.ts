import { create } from 'zustand';

export interface AppStore {
	promptDialogOpen: boolean;
	setPromptDialogOpen: (value: boolean) => void;
	file: File | null;
	setFile: (value: File | null) => void;
	brightness: number;
	setBrightness: (value: number) => void;
	exposure: number;
	setExposure: (value: number) => void;
	contrast: number;
	setContrast: (value: number) => void;
}

const useGlobalStore = create<AppStore>()((set) => ({
	promptDialogOpen: true,
	setPromptDialogOpen: (value) => set({ promptDialogOpen: value }),
	file: null,
	setFile: (value) => set({ file: value, promptDialogOpen: false }),
	brightness: 0,
	setBrightness: (value) => set({ brightness: value }),
	exposure: 1,
	setExposure: (value) => set({ exposure: value }),
	contrast: 0,
	setContrast: (value) => set({ contrast: value }),
}));

export { useGlobalStore };
