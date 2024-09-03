import * as vscode from 'vscode';
import { MsgConfig } from "./@types/messageConfig";
import { FromSource } from './messages/message';

export const getConfig = (): MsgConfig => {
    const config = vscode.workspace.getConfiguration("hotnews");
    return {
        scrollSpeed: config.get<number>("scrollSpeed", 5) * 1000,
        msgSource: config.get<FromSource[]>("msgSource", [FromSource.Weibo]),
        interval: config.get<number>("interval", 60) * 60 * 1000,
    };
};