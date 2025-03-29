import { BaseStep } from "./flow/step";
import { Helper } from "./helper";
import * as al from "@akashic-extension/akashic-label";
import { FontFamily, TextAlign } from "@akashic/akashic-engine";
import { FlowEventName } from "./mainScene";
import { gameLoad_sender, getSender, setSender } from "./sender";
import { actionSender } from "./mainStage";
import { Button } from "./button";
import { layout } from "./stageLayout";
import { aligner, alignMode } from "./aligner";
enum state {
	none,
	running,
	done,
	btnNext,
	btnNextClicked,
}
export class messageWindow extends BaseStep {
	private txtChat: al.Label;
	private sprChatBg: g.Sprite;
	private isTypingEffectMode = false;
	private wating = false;
	private hasAction = false;
	private btnNext: Button;
	private state: state = state.none;
	public onStep(eventName: FlowEventName) {
		switch (eventName) {
			case FlowEventName.GameLoad:
				let scene = g.game.scene();
				const sender: gameLoad_sender = getSender();
				const parent = sender.layout.uiLayer;
				/*this.sprChatBg = Helper.newSprite9Slice(
					"/assets/message_window.png",
					1142,
					240,
					{ top: 10, bottom: 10, left: 10, right: 10 }
				);*/
				this.sprChatBg = Helper.newSprite("/assets/message_window.png")
				parent.append(this.sprChatBg);
				//this.align(this.sprChatBg, -20, 0);
				aligner.align(this.sprChatBg, alignMode.bottom_mid, 0, -20)
				this.txtChat = new al.Label({
					scene: scene,
					parent: this.sprChatBg,
					font: globalThis.font,
					fontSize: 30,
					width: 2000,
					textAlign: TextAlign.Left,
					lineBreak: true,
					widthAutoAdjust: true,
					text: "",
				});
				this.txtChat.x = 50;
				this.txtChat.y = 50;
				this.txtChat.invalidate();
				this.txtChat.modified();
				this.txtChat.hide();
				this.sprChatBg.hide();
				aligner.align(this.txtChat, alignMode.top_left, 30, 30)

				//
				const img = scene.asset.getImage("/assets/btn-mess-next.png");
				this.btnNext = new Button(scene, img, 155, 65);
				this.btnNext.onClick.add(() => {
					this.btnNext.hide();
					this.state = state.btnNextClicked;
				});
				this.sprChatBg.append(this.btnNext)
				aligner.align(this.btnNext, alignMode.bottom_right, 30, 20)
				this.btnNext.hide();
				this.runNext();
				break;
			case FlowEventName.Action:
				{
					const sen: actionSender = getSender();
					this.state = state.running;
					//console.log('message ', sen.action);
					switch (sen.action) {
						case "typing-effect":
							const isTrue = sen.getValue("istrue");
							if (isTrue == undefined) {
								this.isTypingEffectMode = false;
							} else {
								this.isTypingEffectMode =
									isTrue.localeCompare("true") == 1;
							}
							this.state = state.done;
							break;
						case "message":
							{
								this.showMessage(sen.getValue("mess"));
							}
							break;
						case "next-mess-button":
							{
								console.log("net buttn");
								this.state = state.btnNext;
								this.btnNext.show();
							}
							break;
						case "message-hide":
							{
								this.sprChatBg.hide();
							}
							break;
						default:
							this.state = state.done;
							break;
					}
					this.runNext();
				}
				break;
			case FlowEventName.ActionComplete:
				{
					if (this.state == state.btnNextClicked) {
						this.state = state.done;
					}
					if (this.state == state.done) {
						this.runNext();
					} else {
						this.runThisNextFrame();
					}
				}
				break;
		}
	}
	private async showMessage(message: string) {
		if (this.sprChatBg.visible() == false) {
			this.sprChatBg.show();
			this.txtChat.show();
		}
		this.state = state.running;
		if (this.isTypingEffectMode == false) {
			this.txtChat.text = message;
			this.txtChat.invalidate();
			this.state = state.done;
		} else {
			let tmp = "";
			for (var i = 0; i < message.length; i++) {
				tmp += message[i];
				this.txtChat.text = tmp;
				this.txtChat.invalidate();
				await Helper.waitAsync(50);
			}
			await Helper.waitAsync(500);
			this.state = state.done;
		}
	}
	private align(e: g.E, yOffset: number, xOffset: number) {
		const h = g.game.height;
		const w = g.game.width;
		e.anchorY = 1;
		e.anchorX = 0.5;
		e.x = w / 2 + xOffset;
		e.y = h + yOffset;
		e.modified();
	}
}
