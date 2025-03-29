import { BaseStep } from "./flow/step";
import { Helper } from "./helper";
import { TextAlign } from "@akashic/akashic-engine";
import { FlowEventName } from "./mainScene";
import { getSender } from "./sender";
import { layout } from "./stageLayout";
import { actionSender } from "./mainStage";
enum state {
	none,
	wait,
	running,
	done,
}
export class fadeScreen extends BaseStep {
	private state: state = state.none;
	public onStep(eventName: FlowEventName) {
		switch (eventName) {
			case FlowEventName.GameLoad:
				{
					this.runNext();
				}
				break;
			case FlowEventName.Action:
				{
					this.state = state.running;
					const sen: actionSender = getSender();
					switch (sen.action) {
						case "fadeout":
							{
								const time = Number(sen.values);
								this.fadeout(time);
							}
							break;
						case "fadeinout":
							{
								const time = Number(sen.values);
								this.fadeout(time);
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
					if (this.state == state.done) {
						this.runNext();
					} else {
						this.runThisNextFrame();
					}
				}
				break;
			case FlowEventName.LoadSheetFromGoto:
				{

					this.runNext();
				}
				break;
		}
	}
	private async fadeout(time: number) {
		//console.log("fafe with value ", time);
		this.state = state.running;
		await Helper.fadeOutAsync(globalThis.gameLayer, 500);
		await Helper.fadeInAsync(globalThis.gameLayer, 500);
		this.state = state.done;
	}
}
