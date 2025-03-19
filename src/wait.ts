import { BaseStep } from "./flow/step";
import { Helper } from "./helper";
import * as al from "@akashic-extension/akashic-label";
import { FontFamily, TextAlign } from "@akashic/akashic-engine";
import { FlowEventName } from "./mainScene";
import { getSender } from "./sender";
import { actionSender } from "./mainStage";
import { Button } from "./button";
import { layout } from "./stageLayout";
enum state {
	none, running, clicked, complete
}
export class wait extends BaseStep {
	private state: state = state.none
	public onStep(eventName: FlowEventName) {
		switch (eventName) {
			case FlowEventName.GameLoad:
				{
					const scene = g.game.scene();
					scene.onPointUpCapture.add(() => {
						if (this.state == state.running) {
							this.state = state.clicked
						}
					})
					this.runNext();
				}
				break;
			case FlowEventName.Action:
				{
					if (this.state == state.complete) {
						this.state = state.none
						this.runNext()
						break;
					}
					if (this.state == state.none) {
						const sen: actionSender = getSender();
						if (sen.action == 'wait-click') {
							console.log('waittt');
							this.state = state.running;
							this.runThisNextFrame();
						} else {
							this.runNext()
						}
						break;
					}
					if (this.state == state.running || this.state == state.clicked) {
						this.runThisNextFrame()
					}
				}
				break;
			case FlowEventName.ActionComplete:
				{
					if (this.state == state.clicked) {
						this.state = state.complete;
						this.runNext();
						break;
					}
					if (this.state == state.running) {
						this.runThisNextFrame();
						break;
					}
					this.runNext()
				}
				break;
		}
	}

}