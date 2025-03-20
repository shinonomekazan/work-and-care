import { BaseStep } from "./flow/step";
import { Helper } from "./helper";
import * as al from "@akashic-extension/akashic-label";
import { TextAlign } from "@akashic/akashic-engine";
import { FlowEventName } from "./mainScene";
import { getSender } from "./sender";
import { layout } from "./stageLayout";
import { actionSender } from "./mainStage";
enum state {
	none, running, done
}
export class background extends BaseStep {
	private bg: g.Sprite;
	private layer: g.E;
	private rect: g.FilledRect;
	private state: state = state.none;
	public onStep(eventName: FlowEventName) {
		switch (eventName) {
			case FlowEventName.GameLoad:
				const layout: layout = getSender();
				this.layer = layout.background;
				this.setBg('/assets/backgrounds/back_living.png', 0)
				//const scene = g.game.scene();
				//const parent = globalThis.gameLayer;
				//this.rect = new g.FilledRect({
				//	scene: scene,
				//	height: scene.game.height,
				//	width: scene.game.width,
				//	cssColor: 'white'
				//})
				//parent.append(this.rect)

				this.runNext();
				break;
			case FlowEventName.GotoMainStage:

				this.runNext();
				break;
			case FlowEventName.Action:
				{
					const sen: actionSender = getSender();
					switch (sen.action) {
						case 'background':
							this.setBg(`/assets/${sen.getValue('url')}`, 0)
							break;
						default:
					}
					this.runNext();
				}
				break;
			case FlowEventName.ActionComplete:
				{
					//console.log('bg done');
				}
				this.runNext();
				break;
		}
	}
	private setBg(url: string, time: number) {
		console.log('set bg ', url);
		if (this.bg != undefined) {
			this.bg.parent.remove(this.bg)
			this.bg = undefined;
		}
		this.bg = Helper.newSprite(url)
		this.layer.append(this.bg);
	}
}