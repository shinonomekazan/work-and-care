import { BaseStep } from "./flow/step";
import { Helper } from "./helper";
import * as al from "@akashic-extension/akashic-label";
import { TextAlign } from "@akashic/akashic-engine";
import { FlowEventName } from "./mainScene";
import { getSender, setSender } from "./sender";
import { layout } from "./stageLayout";
import { actionSender } from "./mainStage";
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
	public onStep(eventName: FlowEventName) {
		switch (eventName) {
			case FlowEventName.GameLoad:
				const layout: layout = getSender();
				this.layer = layout.charaLayer;
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
						let time = Number(sen.getValue("time"));
						if (isNaN(time)) {
							time = 3;
						}
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

						console.log("t = ", this.text.text);
						this.fill.show();
						this.text.show();
						setSender(undefined);
						Helper.delayCall(() => {
							this.state = state.done;
						}, time * 1000);
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
					}
					this.runNext();
				}
				break;
		}
	}
}
