import { FlowEventName } from "../mainScene";

export class StepFireDebug {
	sprFire: g.Sprite;
	sprFireGray: g.Sprite;
	tag: string;
	private fireTimer = 0;
	active() {
		this.fireTimer = 25;
		this.sprFireGray.hide();
	}
	onUpdate() {
		if (this.fireTimer == 0) {
			this.sprFireGray.show();
		}
		this.fireTimer -= 1;
	}
	addDebug(fire: g.Sprite, sprGray: g.Sprite) {
		this.sprFire = fire;
		this.sprFireGray = sprGray;
	}
}
export class BaseStep {
	public onLoad() {}
	public onUpdate() {}
	public onStep(eventName: FlowEventName) {
		console.log("onstep");
	}
	public static runIndex: number;
	public static readonly runThisNextFrame: number = -1;
	public static readonly runNextNextFrame: number = -2;
	public static readonly flowRemoved: number = -3;
	protected waitOrNext(waitIf: () => boolean) {
		if (waitIf) {
			this.runThisNextFrame();
		} else {
			this.runNext();
		}
	}
	public runThisNextFrame() {
		BaseStep.runIndex = BaseStep.runThisNextFrame;
	}
	public runNext() {
		BaseStep.runIndex++;
	}
}
export class Flow {
	constructor(eventName: FlowEventName, steps: BaseStep[]) {
		this.eventName = eventName;
		this.steps = steps;
	}
	public stepIndex: number = 0;
	public eventName: FlowEventName;
	public steps: BaseStep[] = [];
	public fireDebugs: StepFireDebug[] = [];
}
