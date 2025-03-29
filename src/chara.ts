import { BaseStep } from "./flow/step";
import { Helper } from "./helper";
import { FlowEventName } from "./mainScene";
import { gameLoad_sender, getSender } from "./sender";
import { actionSender } from "./mainStage";
import { layout } from "./stageLayout";
import { Sprite } from "@akashic/akashic-engine";
import { download } from "./download";
import { lineToBox } from "@akashic-extension/collision-js";
enum state {
	none,
	charaShowing,
	charaShowDone,
}
class charaDef {
	name: string;
	currentSpr: g.Sprite;
	face: { face: string; sprite: g.Sprite }[] = [];
	layer: g.E;
	checkExistFace(face: string) {
		for (let i = 0; i < this.face.length; i++) {
			if (this.face[i].face === face) {
				return true
			}
		}
		return false
	}
	async addFace(face: { face: string; link: string, url: string }) {
		let sprite: g.Sprite = undefined;
		if (face.link != undefined) {
			sprite = download.get(face.link)
		} else {
			if (face.url != undefined) {
				sprite = Helper.newSprite(`/assets/${face.url.trim()}`)
			}
		}
		this.face.push({ face: face.face, sprite: sprite });
		this.layer.append(sprite);
		sprite.hide()
	}
	hide() {
		this.face.forEach((f) => {
			f.sprite.hide();
		});
		this.currentSpr = undefined;
	}
	async setFace(
		spr: g.Sprite,
		time: number,
		location: { x: number; y: number } = undefined
	) {
		if (location != undefined) {
			if (isNaN(location.x)) {
				location.x = 0;
			}
			if (isNaN(location.y)) {
				location.y = 0;
			}
			spr.x = location.x;
			spr.y = location.y;
			spr.modified();
		}
		spr.hide();
		if (spr == this.currentSpr) {
			spr.show();
			return;
		}
		if (this.currentSpr != undefined) {
			if (time > 0) {
				spr.opacity = 0
				spr.modified()
				await Helper.crossSprite(spr, this.currentSpr, 500);
				this.currentSpr?.hide();
			}
		} else {
			spr.opacity = 0;
			spr.modified();
			spr.show();
			await Helper.fadeInAsync(spr, time);
		}
		this.currentSpr = spr;
	}
}
export class chara extends BaseStep {
	private state: state = state.none;
	private charas: charaDef[] = [];
	private layer: g.E;
	public onStep(eventName: FlowEventName) {
		switch (eventName) {
			case FlowEventName.GameLoad:
				const sender: gameLoad_sender = getSender();
				this.layer = sender.layout.charaLayer;
				this.runNext();
				break;
			case FlowEventName.Action:
				{
					const sen: actionSender = getSender();
					switch (sen.action) {
						case "chara-def":
							{
								const name = sen.getValue("name");
								const face = sen.getValue("face");
								let findChara: charaDef = undefined;
								for (var i = 0; i < this.charas.length; i++) {
									if (this.charas[i].name == name) {
										findChara = this.charas[i];
										break;
									}
								}
								if (findChara == undefined) {
									console.log("undef", name);
									findChara = new charaDef();
									findChara.layer = new g.E({
										scene: g.game.scene(),
										parent: this.layer,
										tag: "chara-" + name,
									});
									this.charas.push(findChara);
								} else {
									if (findChara.checkExistFace(sen.getValue("face"))) {
										console.error('already chara with face ', face);
									}
								}
								findChara.name = name;
								findChara.addFace({
									face: face,
									url: sen.getValue("img"),
									link: sen.getValue("link"),
								});
								//console.log(this.charas);
							}
							break;
						case "chara-show":
							{
								const name = sen.getValue("name");
								const face = sen.getValue("face");
								let time = Number(sen.getValue("time"));
								let x = Number(sen.getValue("x"));
								let y = Number(sen.getValue("y"));
								let charasFind = this.charas.filter((x) => {
									return x.name == name;
								});
								for (var i = 0; i < charasFind[0].face.length; i++) {
									if (charasFind[0].face[i].face == face) {
										charasFind[0].setFace(
											charasFind[0].face[i].sprite,
											time * 1000,
											{ x: x, y: y }
										);
										break;
									}
								}
							}
							break;
						case "chara-hide":
							{
								const name = sen.getValue("name");
								let charasFind = this.charas.filter((x) => {
									return x.name == name;
								});
								if (charasFind.length > 0) {
									charasFind[0].hide();
								}
							}
							break;
					}
					this.runNext();
				}
				break;
			case FlowEventName.ActionComplete:
				{
					this.runNext();
				}
				break;
		}
	}
}
