import * as React from 'react';

import { useToast } from '@/components/ui/use-toast';
import { siteConfig } from '@/config/site-config';
import { ImageUtils } from '@/lib/image-utils';
import { useFileStore } from '@/store/hooks/useFileStore';

/**
 * --------------------------------------------------
 * This hooks should be on its own file, but for the sake of simplicity, I put it here.
 * --------------------------------------------------
 */
/**
 * This hook is used to get the file and handle the file change.
 */
export const useFileUpload = () => {
	const [imageLoading, setImageLoading] = React.useState(false);

	const { file, setFile } = useFileStore();

	const { toast } = useToast();

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (!file) {
			toast({
				title: 'Error',
				description: 'Please select a file.',
				variant: 'destructive',
			});
			return;
		}

		const ok = siteConfig.image.acceptedImageTypes.includes(file.type);

		if (!ok) {
			toast({
				title: 'Error',
				description: `File type is not supported. Supported file types are ${siteConfig.image.acceptedImageTypes.join(
					', '
				)}`,
				variant: 'destructive',
			});
			return;
		}

		setImageLoading(true);

		const image = new ImageUtils(file);

		try {
			const { width, height } = await image.getNaturalSize();

			if (width > siteConfig.image.maxImageSize || height > siteConfig.image.maxImageSize) {
				setImageLoading(false);

				toast({
					title: 'Error',
					description: `File size is too big. Max file size is ${siteConfig.image.maxImageSize} px`,
					variant: 'destructive',
				});
				return;
			}
		} catch (error) {
			setImageLoading(false);

			toast({
				title: 'Error',
				description: `Unknown error occurred. Please try again.`,
				variant: 'destructive',
			});
			return;
		}

		try {
			setFile(file, await image.createImageElement());

			setImageLoading(false);
		} catch (error) {
			setImageLoading(false);
		}
	};

	return { file, handleFileChange, imageLoading, setImageLoading };
};
