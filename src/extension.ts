import * as vscode from 'vscode';
import * as fs from 'fs';

let myStatusBarItem: vscode.StatusBarItem;
const messages = readMessage();
let readNo = 0;
export function activate({ subscriptions }: vscode.ExtensionContext) {

	const commandId = "sample.helloWorld";
	subscriptions.push(vscode.commands.registerCommand(commandId, () => {
		console.log(`command: ${commandId} readNo:${readNo}`);
		vscode.env.openExternal(vscode.Uri.parse("https://www.baidu.com"));
	}));
	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 300);
	myStatusBarItem.command = commandId;
	subscriptions.push(myStatusBarItem);
	startLoop();

}
const getConfig = () => vscode.workspace.getConfiguration("hotnews");


function readMessage(): any[] {
	try {
		console.log(111, __dirname);
		const data = fs.readFileSync("Users/apu/mywork/learn/vscode_plugin/hotNews/output.json", "utf8");
		const items = JSON.parse(data);
		return items;
	} catch (err) {
		console.log(err);
		return [];
	}
}

function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
async function startLoop() {
	while (true) {
		if (readNo >= messages.length) {
			readNo = 0;
		}
		const message = messages[readNo];
		let title = message.Title;
		if (title.length > 20) {
			title = title.substring(0, 17) + '...';
		}
		console.log(11111, message, message.Title.length, title);
		readNo++;
		myStatusBarItem.text = `${message.FromSource}: ${title}`;
		myStatusBarItem.tooltip = "tooltip";
		myStatusBarItem.show();
		const scrollSpeed = getConfig().scrollSpeed * 1000;
		console.log("speed: ", scrollSpeed);
		await sleep(scrollSpeed);
		myStatusBarItem.hide();
	}
}

export function deactivate() {}
