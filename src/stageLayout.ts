import { BaseStep } from "./flow/step";
import { Helper } from "./helper";
import * as al from "@akashic-extension/akashic-label";
import { Scene, TextAlign } from "@akashic/akashic-engine";
import { FlowEventName } from "./mainScene";
import { getSender, setSender } from "./sender";
export class layout {
	constructor() {
		const scene = g.game.scene();
		this.root = new g.E({
			scene: scene,
			parent: globalThis.gameLayer,
		});
		this.background = this.newE(scene);
		this.charaLayer = this.newE(scene);
		this.uiLayer = this.newE(scene);
		this.message2 = this.newE(scene);
		this.message = this.newE(scene);
	}
	private newE(scene: g.Scene) {
		return new g.E({
			scene: scene,
			parent: this.root,
		});
	}
	root: g.E;
	uiLayer: g.E;
	charaLayer: g.E;
	background: g.E;
	message: g.E;
	message2: g.E;
}
export class stageLayout extends BaseStep {
	private layout: layout;
	public onStep(eventName: FlowEventName) {
		switch (eventName) {
			case FlowEventName.GameLoad:
				this.layout = new layout();
				setSender(this.layout);
				this.runNext();
				break;
		}
	}
}
