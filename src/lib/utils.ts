import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

export const downloadBlob = (blob: Blob, fileName: string) => {
	const a = document.createElement('a');

	document.body.appendChild(a);

	a.style.display = 'none';

	const url = window.URL.createObjectURL(blob);

	a.href = url;

	a.download = fileName;

	a.click();
};
