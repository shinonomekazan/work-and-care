import { BaseStep } from "./flow/step";
import { Helper } from "./helper";
import * as al from "@akashic-extension/akashic-label";
import { Sprite, TextAlign } from "@akashic/akashic-engine";
import { FlowEventName } from "./mainScene";
import { gameLoad_sender, getSender } from "./sender";
import { layout } from "./stageLayout";
import { actionSender } from "./mainStage";
import { download } from "./download";
enum state {
	none,
	running,
	done,
}
export class background extends BaseStep {
	private bg: g.Sprite;
	private layer: g.E;
	private rect: g.FilledRect;
	private state: state = state.none;
	public onStep(eventName: FlowEventName) {
		switch (eventName) {
			case FlowEventName.GameLoad:
				const sender: gameLoad_sender = getSender();
				this.layer = sender.layout.background;
				this.setBg("/assets/backgrounds/back_living.png", 0);
				this.runNext();
				break;
			case FlowEventName.GotoMainStage:
				this.runNext();
				break;
			case FlowEventName.Action:
				{
					const sen: actionSender = getSender();
					switch (sen.action) {
						case "background":
							let imgUrl = sen.getValue("img")
							if (imgUrl != undefined) {
								this.setBg(`/assets/${imgUrl}`, 0);
							} else {
								imgUrl = sen.getValue("link")
								if (imgUrl != undefined) {
									//console.log('setbg link ', imgUrl);
									this.setBgLink(imgUrl, 0);
								} else {
									console.error('not found background');
								}
							}
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
	private async setBgLink(link: string, time: number) {
		let spr = download.get(link)
		if (this.bg != undefined) {
			this.bg.parent.remove(this.bg);
			this.bg = undefined;
		}
		this.bg = spr;
		this.layer.append(this.bg);
	}
	private setBg(url: string, time: number) {
		if (this.bg != undefined) {
			this.bg.parent.remove(this.bg);
			this.bg = undefined;
		}
		this.bg = Helper.newSprite(url);
		this.layer.append(this.bg);
	}
}
