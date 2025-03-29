import { Button } from "./button";
import { BaseStep } from "./flow/step";
import { Helper } from "./helper";
import { FlowEventName } from "./mainScene";
import { gameLoad_sender, getSender } from "./sender";
import { layout } from "./stageLayout";

export class startStage extends BaseStep {
	private btnPlay: Button;
	private playClicked = false;
	private lockClick = false;
	private spriteTitle: g.Sprite;
	private waitFadeout = false;
	public onStep(eventName: FlowEventName) {
		switch (eventName) {
			case FlowEventName.GameLoad:
				const scene = g.game.scene();
				const sender: gameLoad_sender = getSender();
				//console.log(layout);
				this.spriteTitle = Helper.newSprite("/assets/title0.png");
				sender.layout.uiLayer.append(this.spriteTitle);
				this.spriteTitle.x =
					g.game.width / 2 - this.spriteTitle.width / 2;
				this.spriteTitle.y = 100
				this.spriteTitle.modified();
				let img = scene.asset.getImage("/assets/button_start.png");
				this.btnPlay = new Button(scene, img, 553, 108);
				this.btnPlay.onClick.add(() => {
					if (this.lockClick == false) {
						console.log("play clicked");
						this.playClicked = true;
						this.lockClick = true;
					}
				});
				sender.layout.uiLayer.append(this.btnPlay);
				this.btnPlay.x = g.game.width / 2 - this.btnPlay.width / 2;
				this.btnPlay.y =
					g.game.height / 2 - this.btnPlay.height / 2 + 250;
				this.runNext();
				break;
			case FlowEventName.GotoMainStage:
				if (this.waitFadeout) {
					this.runThisNextFrame();
					break;
				}
				if (this.playClicked == true) {
					this.playClicked = false;
					this.btnPlay.hide();
					this.spriteTitle.hide();
					this.runNext();
				} else {
					this.runThisNextFrame();
				}
				break;
		}
	}
}
