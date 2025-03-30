import { buttonAndSheet } from "./buttonLoadSheet";
import { FlowManager } from "./flow/flowManager";
import { FlowEventName } from "./mainScene";
import { layout } from "./stageLayout";
var senders: Map<FlowEventName, object>;
export function initialSender() {
	senders = new Map<FlowEventName, object>();
}
export function setSender(value: any) {
	senders.set(FlowManager.eventName, value);
}
export function getSender(): any {
	return senders.get(FlowManager.eventName);
}
//sender:
export class gameLoad_sender {
	layout: layout;
	buttonLoadSheet: buttonAndSheet[] = [];
	triggerLoadSheet: g.Trigger<string> = new g.Trigger<string>()
}