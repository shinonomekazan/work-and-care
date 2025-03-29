import { startStage } from "../startStage";
import { mainStage } from "../mainStage";
import { BaseStep, Flow, StepFireDebug } from "./step";
import { FlowEventName } from "../mainScene";
import { Helper } from "../helper";
import { Sprite } from "@akashic/akashic-engine";
export class FlowManager {
	public constructor() {}
	public static eventName: FlowEventName;
	public flows: Flow[] = [];
	public currentFlows: Flow[] = [];
	public loop: { [id: string]: boolean } = {};
	ativeDebug() {
		if (globalThis.debugMode == false) {
			return;
		}
		const scene = g.game.scene();
		const parent = globalThis.debugLayer;
		let y = 100;
		this.currentFlows.forEach((flow) => {
			flow.fireDebugs = [];
			let line = new g.FilledRect({
				scene: scene,
				parent: parent,
				x: 0,
				y: y,
				width: 1500,
				height: 5,
				cssColor: "gray",
			});
			let label = Helper.newLable(FlowEventName[flow.eventName]);
			parent.append(label);
			label.fontSize = 17;
			label.invalidate();
			label.y = y;
			label.angle = -60;
			label.modified();
			//
			let xlocalStep = 100;
			flow.steps.forEach((step) => {
				//lab
				let lab = Helper.newLable(step.constructor.name);
				lab.fontSize = 15;
				lab.angle = -15;
				lab.x = xlocalStep;
				lab.y = y;
				parent.append(lab);
				//fire
				let spr = Helper.newSprite("/assets/fire.png");
				spr.anchorY = 1;
				spr.width = 30;
				spr.height = 38;
				spr.invalidate();
				spr.x = xlocalStep;
				spr.y = y;
				spr.modified();
				parent.append(spr);
				//fire gray
				let sprGray = Helper.newSprite("/assets/fire-gray.png");
				sprGray.anchorY = 1;
				sprGray.width = 30;
				sprGray.height = 38;
				sprGray.invalidate();
				sprGray.x = xlocalStep;
				sprGray.y = y;
				sprGray.modified();
				parent.append(sprGray);
				let fireDebug = new StepFireDebug();
				fireDebug.addDebug(spr, sprGray);
				flow.fireDebugs.push(fireDebug);
				xlocalStep += 100;
			});
			y += 100;
		});
	}
	public fire(eventName: FlowEventName, sender: object = undefined) {
		//console.log('fire ', eventName);
		this.loop[eventName.toString()] = false;
		for (let i = 0; i < this.flows.length; i++) {
			if (this.flows[i].eventName == eventName) {
				if (this.currentFlows.includes(this.flows[i])) {
					console.error(
						"Push flow but already exist! ",
						this.flows[i]
					);
				} else {
					this.flows[i].stepIndex = 0;
					this.currentFlows.push(this.flows[i]);
				}
				break;
			}
		}
	}
	public fireLoop(eventName: FlowEventName, sender: object = undefined) {
		this.fire(eventName, sender);
		this.loop[eventName.toString()] = true;
	}
	public onUpdate() {
		for (let i = 0; i < this.currentFlows.length; i++) {
			if (globalThis.debugMode) {
				this.currentFlows[i].fireDebugs.forEach((debug) =>
					debug.onUpdate()
				);
			}
			for (var j = 0; j < this.currentFlows[i].steps.length; j++) {
				this.currentFlows[i].steps[j].onUpdate();
			}
			FlowManager.eventName = this.currentFlows[i].eventName;
			let tmp = 0;
			while (true) {
				tmp++;
				if (tmp == 100) {
					console.error("??", FlowManager.eventName);
					throw this.currentFlows[i].steps[
						this.currentFlows[i].stepIndex
					];
					break;
				}
				if (this.currentFlows[i].steps.length == 0) {
					this.currentFlows.splice(i, 1);
					break;
				}
				if (this.currentFlows[i].stepIndex == BaseStep.flowRemoved) {
					break;
				}
				BaseStep.runIndex = this.currentFlows[i].stepIndex;
				if (globalThis.debugMode) {
					this.currentFlows[i].fireDebugs[
						this.currentFlows[i].stepIndex
					].active();
				}
				this.currentFlows[i].steps[
					this.currentFlows[i].stepIndex
				].onStep(this.currentFlows[i].eventName);
				if (BaseStep.runIndex == BaseStep.runNextNextFrame) {
					BaseStep.runIndex++;
				}
				if (BaseStep.runIndex == BaseStep.runThisNextFrame) {
					break;
				}
				if (BaseStep.runIndex == this.currentFlows[i].steps.length) {
					if (this.loop[this.currentFlows[i].eventName]) {
						BaseStep.runIndex = 0;
						this.currentFlows[i].stepIndex = 0;
					} else {
						this.currentFlows[i].stepIndex = BaseStep.flowRemoved;
					}
					break;
				}
				this.currentFlows[i].stepIndex = BaseStep.runIndex;
			}
		}
	}
	public addFlow(flow: Flow) {
		this.flows.push(flow);
	}
}
