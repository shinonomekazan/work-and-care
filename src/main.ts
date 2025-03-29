import { Scene } from "@akashic/akashic-engine";
import { MainScene } from "./mainScene";

declare global {
	var apiKey: string;
	var font: g.DynamicFont;
	var gameLayer: g.E;
	var debugLayer: g.E;
	var debugMode: boolean;
	var gotoSheetName: string;
}
async function main(param: g.GameMainParameterObject): Promise<void> {
	//console.log(param);
	const urlParams = new URLSearchParams(window.location.search);
	globalThis.debugMode = urlParams.get("debugf") != null;
	globalThis.apiKey = urlParams.get("ggogleapi");
	globalThis.font = new g.DynamicFont({
		game: g.game,
		fontFamily: "M PLUS 1",
		size: 60,
		fontWeight: "bold",
	});
	let scene = new MainScene({
		game: g.game,
		name: "mainscene",
	});
	globalThis.gameLayer = new g.E({
		scene: scene,
		parent: scene,
	});
	globalThis.debugLayer = new g.E({
		scene: scene,
		parent: scene,
	});
	g.game.pushScene(scene);
}
export = main;
