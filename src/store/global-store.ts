import { create } from 'zustand';

export interface AppStore {
	/**
	 * The prompt dialog state
	 */
	promptDialogOpen: boolean;
	setPromptDialogOpen: (value: boolean) => void;

	/**
	 * The file that is currently being edited
	 */
	file: File | null;
	setFile: (value: File | null, texture: HTMLImageElement) => void;
	mainTexture: HTMLImageElement | null;

	/**
	 * Image manipulation values
	 */
	brightness: number;
	setBrightness: (value: number) => void;
	exposure: number;
	setExposure: (value: number) => void;
	contrast: number;
	setContrast: (value: number) => void;
}

export const useGlobalStore = create<AppStore>()((set) => ({
	// --- Prompt dialog ---
	promptDialogOpen: true,
	setPromptDialogOpen: (value) => set({ promptDialogOpen: value }),

	// --- File ---
	file: null,
	setFile: (value, texture) => set({ file: value, promptDialogOpen: false, mainTexture: texture }),
	mainTexture: null,

	// --- Image manipulation values ---
	brightness: 0,
	setBrightness: (value) => set({ brightness: value }),
	exposure: 0,
	setExposure: (value) => set({ exposure: value }),
	contrast: 0,
	setContrast: (value) => set({ contrast: value }),
}));
