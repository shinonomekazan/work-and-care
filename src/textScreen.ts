import { BaseStep } from "./flow/step";
import { Helper } from "./helper";
import * as al from "@akashic-extension/akashic-label";
import { TextAlign } from "@akashic/akashic-engine";
import { FlowEventName } from "./mainScene";
import { gameLoad_sender, getSender, setSender } from "./sender";
import { layout } from "./stageLayout";
import { actionSender } from "./mainStage";
import { Button } from "./button";
enum state {
	none,
	running,
	done,
}
export class textScreen extends BaseStep {
	private layer: g.E;
	private fill: g.FilledRect;
	private text: al.Label;
	private state: state = state.none;
	private button: Button;
	public onStep(eventName: FlowEventName) {
		switch (eventName) {
			case FlowEventName.GameLoad:
				const sender: gameLoad_sender = getSender();
				this.layer = sender.layout.charaLayer;
				const scene = g.game.scene();
				this.fill = new g.FilledRect({
					scene: scene,
					cssColor: "black",
					height: 720,
					width: 1280,
					parent: this.layer,
				});
				this.fill.hide();
				this.text = new al.Label({
					scene: scene,
					width: 1000,
					widthAutoAdjust: true,
					font: Helper.getFont,
					textColor: "white",
					text: "",
					parent: this.layer,
				});
				this.text.hide();
				//button
				const img_test = scene.asset.getImage("/assets/btn-back.png");
				this.button = new Button(scene, img_test, 516, 130);
				this.button.hide()
				sender.layout.uiLayer.append(this.button)
				this.button.onClick.add(() => {
					console.log(this.state);
					if (this.state == state.running) {
						this.state = state.done
						console.log('DONE');
					}
				});
				Helper.alignCenterScreen(this.button)
				this.button.y += 200;
				this.button.modified()
				this.button.modified()
				this.runNext();
				break;
			case FlowEventName.Action:
				{
					if (this.state == state.running) {
						this.runThisNextFrame();
						break;
					}
					const sen: actionSender = getSender();
					if (sen != undefined && sen.action == "text-screen") {
						console.log("xxxxxxxxxxxxx");
						this.state = state.running;
						this.showText(sen);
						let time = Number(sen.getValue("time"));
						if (isNaN(time)) {
							time = 3;
						}
						setSender(undefined);
						Helper.delayCall(() => {
							this.state = state.done;
						}, time * 1000);
						this.runThisNextFrame();
						break;
					}
					if (sen != undefined && sen.action == "text-screen-back") {
						console.log("bbbbbbbbbb");
						this.state = state.running;
						this.showText(sen);
						setSender(undefined);
						this.button.show()
						this.runThisNextFrame();
						break;
					}
				}
				this.runNext();
				break;
			case FlowEventName.ActionComplete:
				if (this.state == state.running) {
					this.runThisNextFrame();
				} else {
					if (this.state == state.done) {
						this.state = state.none;
						this.fill.hide();
						this.text.hide();
						this.button.hide();
					}
					this.runNext();
				}
				break;
		}
	}
	private showText(sen: actionSender) {
		let backColor = sen.getValue("backcolor");
		let textColor = sen.getValue("textcolor");
		if (textColor == undefined) {
			textColor = "white";
		}
		if (backColor == undefined) {
			backColor = "black";
		}
		backColor = "#7cc0ad";
		this.fill.cssColor = backColor;
		this.fill.modified();
		this.text.textColor = textColor;
		this.text.text = sen.getValue("text");
		this.text.invalidate();
		Helper.alignCenterScreen(this.text);
		this.fill.show();
		this.text.show();
	}
}
