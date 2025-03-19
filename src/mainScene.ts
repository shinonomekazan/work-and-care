import { background } from "./background";
import { chara } from "./chara";
import { fadeScreen } from "./fadeScreen";
import { FlowManager } from "./flow/flowManager";
import { Flow } from "./flow/step";
import { loadData } from "./loadData";
import { mainStage } from "./mainStage";
import { messageWindow } from "./messageWindow";
import { options } from "./options";
import { initialSender } from "./sender";
import { stageLayout } from "./stageLayout";
import { startStage } from "./startStage";
import { wait } from "./wait";
export enum FlowEventName {
	Test,
	GameLoad,
	GotoMainStage,
	Action,
	ActionComplete,
	LoadSheet,
}
export class MainScene extends g.Scene {
	private flowManger: FlowManager;
	constructor(param: g.SceneParameterObject) {
		param.assetPaths = [
			"/assets/fire.png",
			"/assets/fire-gray.png",
			"/assets/back_living.png",
			"/assets/title0.png",
			"/assets/button_start.png",
			"/assets/btn-mess-next.png",
			"/assets/message_window.png",
			"/assets/white.png",
			"/assets/data.xml",
			"/assets/test/standing.png",
			"/assets/test/standing2.png",

			"/assets/btn-thuyet-phuc.png",
			"/assets/btn-thao-luan.png",
			"/assets/btn-doc-lap.png",

		];
		super(param);
		this.onLoad.add(this.onGameLoad, this);
		this.onUpdate.add(this.onGameUpdate, this);
	}
	private onGameUpdate() {
		this.flowManger.onUpdate();
	}
	private onGameLoad() {
		initialSender();
		this.flowManger = new FlowManager();
		let _mainStageStep = new mainStage();
		let _startStageStep = new startStage();
		//let _loadDataStep = new loadData();
		let _messageStep = new messageWindow();
		let _backgroundStep = new background();
		let _layoutStep = new stageLayout();
		let _fadeScreenStep = new fadeScreen();
		let _charaStep = new chara();
		let _waitStep = new wait();
		let _optionsStep = new options()
		//FlowEventName.GameLoad
		let flowLoad = new Flow(FlowEventName.GameLoad,
			[
				_layoutStep,
				_backgroundStep,
				_mainStageStep,
				_startStageStep,
				_messageStep,
				_charaStep,
				_waitStep,
				_optionsStep
			]);
		this.flowManger.addFlow(flowLoad);
		//FlowEventName.Test
		let flowTest = new Flow(FlowEventName.Test, []);
		this.flowManger.addFlow(flowTest);
		//FlowEventName.GotoMainStage
		let flowGotoMainStage = new Flow(FlowEventName.GotoMainStage,
			[
				_startStageStep,
				_mainStageStep,
				_backgroundStep
			]);
		this.flowManger.addFlow(flowGotoMainStage);
		//FlowEventName.Action
		let flowAction = new Flow(FlowEventName.Action,
			[
				_mainStageStep,
				_messageStep,
				_fadeScreenStep,
				_backgroundStep,
				_charaStep,
				_waitStep,
				_optionsStep
			]);
		this.flowManger.addFlow(flowAction);
		//FlowEventName.ActionComplete
		let flowActionComplete = new Flow(FlowEventName.ActionComplete,
			[
				_messageStep,
				_backgroundStep,
				_fadeScreenStep,
				_mainStageStep,
				_charaStep,
				_waitStep,
				_optionsStep
			]);
		this.flowManger.addFlow(flowActionComplete);
		//FlowEventName.LoadSheet
		let flowLoadSheet = new Flow(FlowEventName.LoadSheet,
			[
				_optionsStep,
				_mainStageStep,
				_fadeScreenStep
			])
		this.flowManger.addFlow(flowLoadSheet);
		//...fire all flows
		this.flowManger.fire(FlowEventName.GameLoad);
		this.flowManger.fire(FlowEventName.GotoMainStage);
		this.flowManger.fireLoop(FlowEventName.Action);
		this.flowManger.fireLoop(FlowEventName.ActionComplete);
		this.flowManger.fireLoop(FlowEventName.LoadSheet);

		this.flowManger.ativeDebug()
	}

}