export class ImageUtils {
	constructor(protected image: File) {}

	get(): File {
		return this.image;
	}

	set = (image: File) => {
		this.image = image;
	};

	async getNaturalSize(): Promise<{ width: number; height: number }> {
		const img = await this.createImageElement();

		return {
			width: img.naturalWidth,
			height: img.naturalHeight,
		};
	}

	createImageElement(): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const image = new Image();
			image.addEventListener('load', () => resolve(image));
			image.addEventListener('error', (error) => reject(error));
			image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox

			image.src = URL.createObjectURL(this.image);
		});
	}

	getImageSrc(): string {
		return URL.createObjectURL(this.image);
	}
}

export class ImageCropUtils extends ImageUtils {
	constructor(protected readonly image: File) {
		super(image);
	}

	async validate(maxW: number, maxH: number) {
		const { width, height } = await super.getNaturalSize();

		return {
			widthOk: width < maxW,
			heightOk: height < maxH,
			width,
			height,
		};
	}

	async reduceImageQuality(): Promise<File> {
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d', { alpha: true });

		if (!context) {
			return super.get();
		}

		context.drawImage(await this.createImageElement(), 0, 0);

		return new Promise((res) => {
			canvas.toBlob(
				(blog) => {
					if (blog) {
						res(new File([blog], super.get().name + `.webp`, { type: blog.type }));
					}
				},
				'image/webp',
				0.95
			);
		});
	}
}
