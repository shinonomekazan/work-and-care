import { FlowManager } from "./flow/flowManager";
import { FlowEventName } from "./mainScene";
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
