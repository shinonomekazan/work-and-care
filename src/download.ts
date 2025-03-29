class spriteStore {
	link: string;
	sprite: g.Sprite;
}
export class download {
	static sprites: spriteStore[] = [];
	static needDownload(link: string) {
		for (var i = 0; i < download.sprites.length; i++) {
			if (download.sprites[i].link === link) {
				return false
			}
		}
		return true
	}
	static get(link: string) {
		for (var i = 0; i < download.sprites.length; i++) {
			if (download.sprites[i].link === link) {
				return download.sprites[i].sprite
			}
		}
		return null
	}
	static async downloadImage(link: string) {
		let needDownload = download.needDownload(link)
		if (needDownload) {
			let newSprite: spriteStore = new spriteStore();
			newSprite.link = link;
			this.sprites.push(newSprite)
			newSprite.sprite = await this.downloadWithLink(link, "dynamicImage" + this.sprites.length)
		} else {
			console.log('alreay download ', link);
		}
	}
	private static async downloadWithLink(link: string, assetId: string) {
		const scene = g.game.scene();
		const img = new Image();
		await new Promise<void>((resolve, reject) => {
			img.onload = () => resolve();
			img.onerror = () => reject(new Error("Failed to load image"));
			img.src = link;
		});
		return await new Promise<g.Sprite | null>((resolve, reject) => {
			const handler: g.AssetManagerLoadHandler = {
				_onAssetLoad: (asset: g.Asset) => {
					if (asset.type === "image") {
						const imageAsset = asset as g.ImageAsset;
						const sprite = new g.Sprite({
							scene: scene,
							src: imageAsset,
							width: imageAsset.width,
							height: imageAsset.height,
						});
						resolve(sprite);
					}
				},
				_onAssetError: (asset: g.Asset, error: g.AssetLoadError) => {
					console.error("Failed to load asset:", asset, error);
					reject(error);
				},
			};
			g.game._assetManager.requestAssets(
				[
					{
						id: assetId,
						type: "image",
						uri: link,
						width: img.width,
						height: img.height,
					},
				],
				handler
			);
		});
	}
}