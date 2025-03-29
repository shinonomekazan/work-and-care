import { BaseStep } from "./flow/step";
import { Helper } from "./helper";
import * as al from "@akashic-extension/akashic-label";
import { FontFamily, TextAlign } from "@akashic/akashic-engine";
import { FlowEventName } from "./mainScene";
import { getSender, setSender } from "./sender";
import { actionSender } from "./mainStage";
import { Button } from "./button";
import { layout } from "./stageLayout";
enum state {
	none,
	running,
	done,
	btnNext,
	btnNextClicked,
}
export class options extends BaseStep {
	private btn_thuyetphuc: Button;
	private btn_thaoluan: Button;
	private btn_doclap: Button;
	private sheetTarget: string;
	public onStep(eventName: FlowEventName) {
		switch (eventName) {
			case FlowEventName.GameLoad:
				{
					const scene = g.game.scene();
					const layout: layout = getSender();
					const parent = layout.uiLayer;
					//thaoluan
					const img_thaoluan = scene.asset.getImage(
						"/assets/btn-thao-luan.png"
					);
					this.btn_thaoluan = new Button(
						scene,
						img_thaoluan,
						516,
						130
					);
					this.btn_thaoluan.onClick.add(() => {
						console.log("thaoluan");
						this.sheetTarget = "7.1";
					});
					parent.append(this.btn_thaoluan);
					this.btn_thaoluan.hide();
					//doclap
					const img_doclap = scene.asset.getImage(
						"/assets/btn-doc-lap.png"
					);
					this.btn_doclap = new Button(scene, img_doclap, 516, 130);
					this.btn_doclap.onClick.add(() => {
						this.sheetTarget = "8.1";
					});
					parent.append(this.btn_doclap);
					this.btn_doclap.hide();
					//thuyetphuc
					const img_thuyetphuc = scene.asset.getImage(
						"/assets/btn-thuyet-phuc.png"
					);
					this.btn_thuyetphuc = new Button(scene, img_thuyetphuc, 516, 130);
					this.btn_thuyetphuc.onClick.add(() => {
						this.sheetTarget = "6.1";
					});
					parent.append(this.btn_thuyetphuc);
					this.btn_thuyetphuc.hide();
					this.alignButtons(
						[
							this.btn_thuyetphuc,
							this.btn_thaoluan,
							this.btn_doclap,
						],
						10
					);
				}
				this.runNext();
				break;
			case FlowEventName.Action:
				{
					const sen: actionSender = getSender();
					if (sen.action == "options-sheet") {
						if (sen.getValue("id") == "1") {
							console.log("sheet 1");
							this.setActiveOp1(true);
						}
					}
					this.runNext();
				}
				break;
			case FlowEventName.ActionComplete:
				{
					this.runNext();
				}
				break;
			case FlowEventName.LoadSheet:
				{
					if (this.sheetTarget != undefined) {
						setSender(this.sheetTarget);
						this.sheetTarget = undefined;
						this.setActiveOp1(false);
						this.runNext();
					} else {
						this.runThisNextFrame();
					}
				}
				break;
		}
	}
	private setActiveOp1(active: boolean) {
		if (active) {
			this.btn_doclap.show();
			this.btn_thaoluan.show();
			this.btn_thuyetphuc.show();
		} else {
			this.btn_doclap.hide();
			this.btn_thaoluan.hide();
			this.btn_thuyetphuc.hide();
		}
	}
	private alignButtons(buttons: Button[], offset: number) {
		const w = g.game.width;
		const xCenter = w / 2;
		let bh = 0;
		buttons.forEach((b) => {
			bh += b.height;
			bh += offset;
		});
		let top = bh / 2;
		buttons.forEach((b) => {
			b.x = xCenter - b.width / 2;
			b.y = top;
			top += b.height;
			top += offset;
		});
	}
}
