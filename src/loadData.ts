import { BaseStep } from "./flow/step";
import { FlowEventName } from "./mainScene";
import { setSender } from "./sender";
export class loadData extends BaseStep {
	public onStep(eventName: FlowEventName) {
		switch (eventName) {
			case FlowEventName.GameLoad:
				//let scene = g.game.scene();
				//let t = scene.asset.getText('/assets/data.xml').data;
				//var parse = new DOMParser();
				//let xmlDoc = parse.parseFromString(t, "text/xml")
				//const root = xmlDoc.documentElement;
				//setSender(root)
				this.runNext();
				break;
		}
	}
}
