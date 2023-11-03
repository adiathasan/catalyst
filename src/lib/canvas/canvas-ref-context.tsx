'use client';

import * as React from 'react';

export const CanvasRefContext = React.createContext<React.RefObject<HTMLCanvasElement> | null>(null);

export const CanvasRefProvider = ({ children }: { children: React.ReactNode }) => {
	const canvasRef = React.useRef<HTMLCanvasElement>(null);

	return <CanvasRefContext.Provider value={canvasRef}>{children}</CanvasRefContext.Provider>;
};

export const useCanvasRef = () => {
	const canvasRef = React.useContext(CanvasRefContext);

	if (!canvasRef) {
		throw new Error('useCanvasRef must be used within a CanvasRefProvider');
	}

	return canvasRef;
};
