export class Button extends g.FrameSprite {
	readonly onClick: g.Trigger = new g.Trigger();
	private actived = true;
	constructor(
		scene: g.Scene,
		src: g.ImageAsset | g.Surface,
		width: number,
		height: number
	) {
		super({
			scene: scene,
			src: src,
			width: width,
			height: height,
			frameNumber: 0,
			frames: [0, 1, 2], //normal, click, disable
			touchable: true,
		});
		this.onPointUp.add(() => {
			if (this.actived == false) {
				return;
			}
			this.frameNumber = 0;
			this.modified();
			this.onClick.fire();
		});
		this.onPointDown.add(() => {
			if (this.actived == false) {
				return;
			}
			this.frameNumber = 1;
			this.modified();
		});
	}
	setActive(active: boolean) {
		this.actived = active;
		if (this.actived) {
			this.frames = [0];
			this.modified();
		} else {
			this.frames = [1];
			this.modified();
		}
	}
}
