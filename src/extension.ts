import * as vscode from 'vscode';
import * as fs from 'fs';
import { Message } from './messageType';
import { Douyin } from './messages/douyin';
import { Zhihu } from './messages/zhihu';

let myStatusBarItem: vscode.StatusBarItem;
let messages: Message[] = [];
let readNo = 0;
let currMessage: Message;
export async function activate({ subscriptions }: vscode.ExtensionContext) {
	const zhihuData = await (new Zhihu().getMessages());
	const douyinData = await (new Douyin().getMessages());
	messages.push(...zhihuData);
	messages.push(...douyinData);
	console.log("total length:", messages.length);
	const commandId = "hotnews.moyu";
	subscriptions.push(vscode.commands.registerCommand(commandId, () => {
		if (currMessage?.Url) {
			vscode.env.openExternal(vscode.Uri.parse(currMessage?.Url));
		}
	}));
	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 200);
	myStatusBarItem.command = commandId;
	subscriptions.push(myStatusBarItem);
	startLoop();

}
const getConfig = () => vscode.workspace.getConfiguration("hotnews");

function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
async function startLoop() {
	while (true) {
		if (readNo >= messages.length) {
			readNo = 0;
		}
		currMessage = messages[readNo] ?? '';
		if (currMessage) {
			let title = currMessage.Title;
			if (title.length > 20) {
				title = title.substring(0, 17) + '...';
			}
			readNo++;
			myStatusBarItem.text = `${currMessage.FromSource}: 热度: ${getHotValue(currMessage.HotValue)} ${title}`;
			myStatusBarItem.tooltip = "tooltip";
			myStatusBarItem.show();
			const scrollSpeed = getConfig().scrollSpeed * 1000;
			await sleep(scrollSpeed);

		}
		myStatusBarItem.hide();
	}
}
const getHotValue = (value: number) => {
	if (value > 10000) {
		return `${Math.ceil(value / 10000)}万`;
	} else if (value > 1000) {
		return `${Math.ceil(value / 1000)}千`;
	}
	return value.toString();

};

export function deactivate() { }
