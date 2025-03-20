import { BaseStep } from "./flow/step";
import { FlowEventName } from "./mainScene";
import { getSender, setSender } from "./sender";
export class actionSender {
	action: string;
	values: { id: string, value: string }[]
	setValue(values: { id: string, value: string }[]) {

	}
	setValuesFrom(values: string[]) {
		this.values = [];
		for (var i = 1; i < values.length; i++) {
			let split = values[i].split('=')
			this.values.push({
				id: split[0],
				value: split[1]
			})
		}
	}
	getValue(name: string): string {
		for (var i = 0; i < this.values.length; i++) {
			if (this.values[i].id == name) {
				return this.values[i].value;
			}
		}
		return undefined;
	}
}
export class mainStage extends BaseStep {
	private sheetScript: string[][];
	private index = 0;
	private waitComplete = false;
	private waitLoadSheet = false;
	private finish = false;
	private gotoMainState = false;
	public onStep(eventName: FlowEventName) {
		switch (eventName) {
			case FlowEventName.GameLoad:
				this.loadGoogleSheet('start')
				this.runNext();
				break;
			case FlowEventName.GotoMainStage:
				this.gotoMainState = true;
				this.runNext();
				break;
			case FlowEventName.Action:
				{
					if (this.waitLoadSheet || this.finish || this.gotoMainState == false) {
						this.runThisNextFrame();
						break;
					}
					if (this.waitComplete) {
						this.runThisNextFrame();
					} else {
						if (this.index < this.sheetScript.length) {
							console.log('RUN');
							this.process()
						} else {
							console.log('FINISH!');
							this.finish = true;
						}
					}
				}
				break;
			case FlowEventName.ActionComplete:
				{
					if (this.finish || this.gotoMainState == false) {
						this.runThisNextFrame()
						break;
					}
					this.waitComplete = false;
					this.runNext();
				}
				break;
			case FlowEventName.LoadSheet:
				{
					const sen: string = getSender()
					console.log('loaddsheet ', sen);
					this.waitComplete = false;
					this.finish = false
					this.index = 0;
					this.loadGoogleSheet(sen)
					this.runNext();
				}
				break;
		}

	}
	private process() {
		let runNext = false;
		let text = this.sheetScript[this.index]
		while (text.length == 0 || text[0] == '#') {
			this.index++;
			text = this.sheetScript[this.index]
			if (this.index == this.sheetScript.length) {
				break;
			}
		}
		switch (text[1]) {
			case 'typing-effect':
				{
					let sen = new actionSender();
					sen.action = text[1];
					sen.values = [
						{
							id: 'istrue', value: text[2]
						}
					];
					setSender(sen);
					this.runNext();
					runNext = true;
				}
				break;
			case '':
				{
					this.waitComplete = true;
					let sen = new actionSender();
					sen.action = 'message';
					sen.values = [
						{
							id: 'mess', value: text[2]
						}
					];
					console.log('.,,,,', sen.values);
					setSender(sen);
					this.runNext();
					runNext = true;
				}
				break;
			case 'fadeinout':
				{
					this.waitComplete = true;
					let sen = new actionSender();
					sen.action = 'fadeout';
					const str = text[2];
					const match = str.match(/=(\d+)/);
					sen.values = [
						{
							id: 'time', value: match ? match[1] : '0'
						}
					];
					setSender(sen);
					this.runNext();
					runNext = true;
				}
				break;
			case 'next-mess-button':
				{
					this.waitComplete = true;
					let sen = new actionSender();
					sen.action = 'next-mess-button';

					setSender(sen);
					this.runNext();
					runNext = true;
				}
				break;
			case 'background':
				{
					this.waitComplete = true;
					let sen = new actionSender();
					sen.action = 'background';
					sen.values = [
						{
							id: 'url',
							value: text[2]
						}
					]
					setSender(sen);
					this.runNext();
					runNext = true;
				}
				break;
			case 'chara-def':
				{
					let sen = new actionSender();
					sen.action = 'chara-def';
					sen.setValuesFrom(text)
					setSender(sen);
					this.runNext();
					runNext = true;
				}
				break;
			case 'chara-show':
				{
					this.waitComplete = true;
					let sen = new actionSender();
					sen.action = 'chara-show';
					sen.setValuesFrom(text)
					setSender(sen);
					this.runNext();
					runNext = true;
				}
				break;
			case 'chara-hide':
				{
					this.waitComplete = true;
					let sen = new actionSender();
					sen.action = 'chara-hide';
					sen.setValuesFrom(text)
					setSender(sen);
					this.runNext();
					runNext = true;
				}
				break;
			case 'message-hide':
				{
					let sen = new actionSender();
					sen.action = 'message-hide';
					setSender(sen);
					this.runNext();
					runNext = true;
				}
				break;
			case 'wait-click':
				{
					let sen = new actionSender();
					sen.action = 'wait-click';
					setSender(sen);
					this.runNext();
					runNext = true;
				}
				break;
			case 'options-sheet':
				{
					let sen = new actionSender();
					sen.action = 'options-sheet';
					sen.setValuesFrom(text)
					setSender(sen);
					this.runNext();
					runNext = true;
				}
				break;
			default:
				break;
		}
		console.log('index ', this.index);
		this.index++;
		if (runNext == false) {
			this.runThisNextFrame()
		}
	}
	private async loadGoogleSheet(sheetName: string) {
		this.waitLoadSheet = true;
		const urlParams = new URLSearchParams(window.location.search);
		const SHEET_ID = urlParams.get('sheetid')
		const API_KEY = urlParams.get('ggogleapi')
		if (SHEET_ID == null || API_KEY == null) {
			throw ('api not found')
		}
		const RANGE = `${sheetName}!A1:I100`;
		const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
		try {
			const response = await fetch(url);
			const data = await response.json();
			this.sheetScript = data.values;
			this.waitLoadSheet = false;
			console.log(this.sheetScript);
		} catch (error) {
			console.error("Error Google Sheet:", error);
		}
	}
}