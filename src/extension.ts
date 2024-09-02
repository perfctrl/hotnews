import * as vscode from 'vscode';
import { Message } from './@types/messageType';
import { getConfig } from './initConfig';
import { MsgConfig } from './@types/messageConfig';
import { MessageFactory } from './messages/factories';
import { formatDisplayMessage, formatHotValue, formatTooltipMessage } from './screen/screen';
import { loggerInfo } from './logs/logger';

let myStatusBarItem: vscode.StatusBarItem;
let messages: Message[] = [];
let readNo: number = 0;
let currMessage: Message;
let scrollFlag: boolean = true;
let intervalId: NodeJS.Timeout | undefined;

export async function activate(context: vscode.ExtensionContext) {

	initCommand(context);

	start(getConfig(), true);

}

const initCommand = (context: vscode.ExtensionContext) => {
	const commandId = "hotnews.moyu";
	const startCommandId = "hotnews.start";
	const stopCommandId = "hotnews.stop";
	const refreshCommandId = "hotnews.refresh";

	context.subscriptions.push(vscode.commands.registerCommand(commandId, () => {
		if (currMessage?.Url) {
			vscode.env.openExternal(vscode.Uri.parse(currMessage?.Url));
		}
	}));
	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 200);
	myStatusBarItem.command = commandId;
	context.subscriptions.push(myStatusBarItem);

	const startCommand = vscode.commands.registerCommand(startCommandId, () => {
		if (scrollFlag) {
			return;
		}
		start(getConfig(), true);
	});
	context.subscriptions.push(startCommand);

	const stopCommand = vscode.commands.registerCommand(stopCommandId, () => {
		if (!scrollFlag) {
			return;
		}
		stop();
	});
	context.subscriptions.push(stopCommand);

	const refreshCommand = vscode.commands.registerCommand(refreshCommandId, async () => {
		if (!scrollFlag) {
			vscode.window.showInformationMessage('暂无法刷新,请先start');
		} else {
			stop();
			setTimeout(() => {
				start(getConfig(), true);
				vscode.window.showInformationMessage('已刷新最想热搜榜...');
			}, getConfig().scrollSpeed * 1000 + 120);

		}
	});
	context.subscriptions.push(refreshCommand);

	vscode.workspace.onDidChangeConfiguration(event => {
		if (event.affectsConfiguration('hotnews.interval') || event.affectsConfiguration('hotnews.scrollSpeed') || event.affectsConfiguration("hotnews.msgSource")) {
			stop();
			setTimeout(() => start(getConfig(), true), getConfig().scrollSpeed * 1000 + 120);
		}
	});

};

const initRollingMessages = async (config: MsgConfig) => {
	loggerInfo("fetch message: start");
	messages = await (new MessageFactory(config.msgSource).factories());
	loggerInfo(`fetch message: end: length: ${messages.length}`);
	readNo = 0;

	startRolling(config);
};

const stop = () => {
	scrollFlag = false;
	clearInterval(intervalId);
	intervalId = undefined;
	myStatusBarItem.hide();

};

const start = (config: MsgConfig, init: boolean = false) => {
	if (init) {
		scrollFlag = true;
		initRollingMessages(config);
	}
	if (intervalId) {
		clearInterval(intervalId);
	}
	intervalId = setTimeout(async () => {
		await initRollingMessages(config);
		start(config, false);
	}, config.interval * 60 * 1000);

};
const sleep = (ms: number) => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

const startRolling = async (config: MsgConfig) => {
	loggerInfo(`start.., ${scrollFlag}, ${messages.length}`);
	while (scrollFlag && messages.length > 0) {
		if (readNo >= messages.length) {
			readNo = 0;
		}
		currMessage = messages[readNo] ?? '';
		loggerInfo(currMessage);
		if (currMessage) {
			readNo++;
			myStatusBarItem.text = formatDisplayMessage(currMessage);
			myStatusBarItem.tooltip = formatTooltipMessage(currMessage);
			myStatusBarItem.show();
			await sleep(config.scrollSpeed * 1000);

		}
		myStatusBarItem.hide();
	}
	myStatusBarItem.hide();
	loggerInfo("start.. finish rolling");
};

export function deactivate() { }
