import { useGlobalStore } from '../global-store';

/**
 * This hook is used to get the prompt dialog and handle the prompt dialog change.
 */
export const usePromptDialog = () =>
	useGlobalStore((state) => ({
		promptDialogOpen: state.promptDialogOpen,
		setPromptDialogOpen: state.setPromptDialogOpen,
	}));
