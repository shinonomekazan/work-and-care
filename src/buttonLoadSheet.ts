import { BaseStep } from "./flow/step";
import { Helper } from "./helper";
import * as al from "@akashic-extension/akashic-label";
import { FontFamily, TextAlign } from "@akashic/akashic-engine";
import { FlowEventName } from "./mainScene";
import { gameLoad_sender, getSender, setSender } from "./sender";
import { actionSender } from "./mainStage";
import { Button } from "./button";
import { layout } from "./stageLayout";
export class buttonAndSheet {
	constructor(button: Button, sheet: string) {
		this.button = button;
		this.sheet = sheet;
	}
	button: Button;
	sheet: string;
}
enum state {
	none,
	startLoad,
	loading,
	done
}
export class buttonLoadSheet extends BaseStep {
	private target: string;
	private state: state = state.none;
	public onStep(eventName: FlowEventName) {
		switch (eventName) {
			case FlowEventName.GameLoad:
				{
					const senser: gameLoad_sender = getSender();
					senser.buttonLoadSheet.forEach(btn => {
						btn.button.onClick.add(() => {
							this.loadSheet(btn.sheet)
						})
					})
					senser.triggerLoadSheet.add((sheetName) => {
						this.loadSheet(sheetName)
					})
				}
				this.runNext()
				break;
			case FlowEventName.LoadSheet_start:
				{
					this.runNext();
				}
				break;
			case FlowEventName.LoadSheet_end:
				{
					this.state = state.none;
					this.runNext();
				}
				break;
			case FlowEventName.LoadSheetByButton:
				{
					if (this.state == state.none) {
						this.runThisNextFrame()
						break
					}
					if (this.state == state.startLoad) {
						console.log('set ', this.target);
						this.state = state.loading;
						setSender(this.target)
						this.target = undefined
						this.runNext();
					} else {
						this.runThisNextFrame()
					}
				}
				break;

		}
	}
	private loadSheet(name: string) {
		if (this.state == state.none) {
			this.target = name;
			this.state = state.startLoad
			console.log('buttonLoadSheet->>gotosheet: ', this.target);
		}
	}
}