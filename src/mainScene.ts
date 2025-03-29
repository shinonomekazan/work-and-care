import { background } from "./background";
import { buttonLoadSheet } from "./buttonLoadSheet";
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
import { textScreen } from "./textScreen";
import { wait } from "./wait";
export enum FlowEventName {
	Test,
	GameLoad,
	GotoMainStage,
	Action,
	ActionComplete,
	LoadSheetFromGoto,
	LoadSheet_start,
	LoadSheet_end,
}
export class MainScene extends g.Scene {
	private flowManger: FlowManager;
	constructor(param: g.SceneParameterObject) {
		param.assetPaths = [
			"/assets/fire.png",
			"/assets/fire-gray.png",
			"/assets/backgrounds/back_living.png",
			"/assets/title0.png",
			"/assets/button_start.png",
			"/assets/btn-mess-next.png",
			"/assets/message_window.png",
			"/assets/white.png",
			"/assets/btn-test.png",

			//background
			"/assets/backgrounds/bia_1.jpg",
			"/assets/backgrounds/back_class.jpg",
			"/assets/backgrounds/back_office.jpg",
			"/assets/backgrounds/swiming.jpg",
			"/assets/btn-thuyet-phuc.png",
			"/assets/btn-thao-luan.png",
			"/assets/btn-doc-lap.png",

			//charactors

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
		const _mainStageStep = new mainStage();
		const _startStageStep = new startStage();
		const _messageStep = new messageWindow();
		const _backgroundStep = new background();
		const _layoutStep = new stageLayout();
		const _fadeScreenStep = new fadeScreen();
		const _charaStep = new chara();
		const _waitStep = new wait();
		const _optionsStep = new options();
		const _textScreenStep = new textScreen();
		const _buttonLoadSheet = new buttonLoadSheet();
		//FlowEventName.GameLoad
		const flowLoad = new Flow(FlowEventName.GameLoad, [
			_layoutStep,
			_backgroundStep,
			_mainStageStep,
			_startStageStep,
			_messageStep,
			_charaStep,
			_waitStep,
			_optionsStep,
			_textScreenStep,
			_buttonLoadSheet
		]);
		this.flowManger.addFlow(flowLoad);
		//FlowEventName.Test
		const flowTest = new Flow(FlowEventName.Test, []);
		this.flowManger.addFlow(flowTest);
		//FlowEventName.GotoMainStage
		const flowGotoMainStage = new Flow(FlowEventName.GotoMainStage, [
			_startStageStep,
			_mainStageStep,
			_backgroundStep,
		]);
		this.flowManger.addFlow(flowGotoMainStage);
		//FlowEventName.Action
		const flowAction = new Flow(FlowEventName.Action, [
			_mainStageStep,
			_messageStep,
			_fadeScreenStep,
			_backgroundStep,
			_charaStep,
			_waitStep,
			_optionsStep,
			_textScreenStep,
		]);
		this.flowManger.addFlow(flowAction);
		//FlowEventName.ActionComplete
		const flowActionComplete = new Flow(FlowEventName.ActionComplete, [
			_messageStep,
			_backgroundStep,
			_fadeScreenStep,
			_mainStageStep,
			_charaStep,
			_waitStep,
			_optionsStep,
			_textScreenStep,
		]);
		this.flowManger.addFlow(flowActionComplete);
		//FlowEventName.LoadSheetFromGoto
		const flowLoadSheetGoto = new Flow(FlowEventName.LoadSheetFromGoto, [
			_buttonLoadSheet,
			_mainStageStep,
			_fadeScreenStep,
		]);
		this.flowManger.addFlow(flowLoadSheetGoto);
		//FlowEventName.LoadSheet_start
		const flowLoadSheetStart = new Flow(FlowEventName.LoadSheet_start, [
			_mainStageStep,
			_optionsStep,
			_buttonLoadSheet,
		]);
		this.flowManger.addFlow(flowLoadSheetStart);
		//FlowEventName.LoadSheet_end
		const flowLoadSheetEnd = new Flow(FlowEventName.LoadSheet_end, [
			_mainStageStep,
			_buttonLoadSheet,
		]);
		this.flowManger.addFlow(flowLoadSheetEnd);
		//...fire all flows
		this.flowManger.fire(FlowEventName.GameLoad);
		this.flowManger.fire(FlowEventName.GotoMainStage);
		this.flowManger.fireLoop(FlowEventName.Action);
		this.flowManger.fireLoop(FlowEventName.ActionComplete);
		this.flowManger.fireLoop(FlowEventName.LoadSheetFromGoto);
		this.flowManger.fireLoop(FlowEventName.LoadSheet_start);
		this.flowManger.fireLoop(FlowEventName.LoadSheet_end);

		this.flowManger.ativeDebug();
	}
}
