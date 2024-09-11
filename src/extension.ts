import * as vscode from 'vscode';
import { Message } from './@types/messageType';
import { getConfig } from './initConfig';
import { MsgConfig } from './@types/messageConfig';
import { MessageFactory } from './messages/factories';
import { formatDisplayMessage, formatTooltipMessage } from './screen/screen';
import { loggerInfo } from './logs/logger';
import isEmpty from 'lodash/isEmpty';

let myStatusBarItem: vscode.StatusBarItem;
let messages: Message[] = [];
let readNo: number = 0;
let currMessage: Message;
let updateMessagesIntervalId: NodeJS.Timeout | undefined;
let configChangeIntervalId: NodeJS.Timeout | undefined;
let rollingIntervalId: NodeJS.Timeout | undefined;

export async function activate(context: vscode.ExtensionContext) {

	initPlugin(context);

	start();

}

const initPlugin = (context: vscode.ExtensionContext) => {

	const commandId = "hotnews.moyu";

	context.subscriptions.push(vscode.commands.registerCommand(commandId, () => {
		if (currMessage?.Url) {
			vscode.env.openExternal(vscode.Uri.parse(currMessage?.Url));
		}
	}));
	myStatusBarItem = vscode.window.createStatusBarItem('gitlens-graph', vscode.StatusBarAlignment.Right, 200);
	myStatusBarItem.command = commandId;
	context.subscriptions.push(myStatusBarItem);

	const startCommand = vscode.commands.registerCommand("hotnews.start", () => {
		if (!rollingIntervalId) {
			start();
		}
	});
	context.subscriptions.push(startCommand);

	const stopCommand = vscode.commands.registerCommand("hotnews.stop", () => {
		if (rollingIntervalId) {
			stop();
		}
	});
	context.subscriptions.push(stopCommand);

	const refreshCommand = vscode.commands.registerCommand("hotnews.refresh", async () => {
		if (!rollingIntervalId) {
			vscode.window.showInformationMessage('暂无法刷新,请先Start');
		} else {
			stop();
			start(() => vscode.window.showInformationMessage('已刷新最新热搜榜...'));
		}
	});
	context.subscriptions.push(refreshCommand);

	vscode.workspace.onDidChangeConfiguration(event => {
		if (event.affectsConfiguration('hotnews.interval') || event.affectsConfiguration('hotnews.scrollSpeed') || event.affectsConfiguration("hotnews.msgSource")) {
			if (configChangeIntervalId) {
				clearTimeout(configChangeIntervalId);
			}
			configChangeIntervalId = setTimeout(() => {
				stop();
				start(() => vscode.window.showInformationMessage('配置已生效...'));
			}, 5000);
		}
	});

};

const initRollingMessages = async (config: MsgConfig) => {
	loggerInfo("fetch message: start");
	messages = await (new MessageFactory(config.msgSource).factories());
	loggerInfo(`fetch message: end: length: ${messages.length}`);
	startRolling(config);
};


const start = async (callback: undefined | Function = undefined) => {
	const config = getConfig();
	if (isEmpty(messages)) {
		await initRollingMessages(config);
	}
	if (callback) {
		callback();
	}
	if (updateMessagesIntervalId) {
		clearTimeout(updateMessagesIntervalId);
	}
	updateMessagesIntervalId = setTimeout(async () => {
		await initRollingMessages(config);
		start();
	}, config.interval);

};
const stop = () => {
	if (updateMessagesIntervalId) {
		clearTimeout(updateMessagesIntervalId);
		updateMessagesIntervalId = undefined;
	}
	if (configChangeIntervalId) {
		clearTimeout(configChangeIntervalId);
		configChangeIntervalId = undefined;
	}
	if (rollingIntervalId) {
		clearInterval(rollingIntervalId);
		rollingIntervalId = undefined;
	}
	readNo = 0;
	messages = [];
	myStatusBarItem.hide();
};

const startRolling = (config: MsgConfig) => {
	if (rollingIntervalId) {
		clearInterval(rollingIntervalId);
	}
	rollingIntervalId = setInterval(() => {
		myStatusBarItem.hide();
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

		}
	}, config.scrollSpeed);
};

export function deactivate() {
	stop();
}
