import { load } from 'cheerio';
import { Message } from './@types/messageType';
import * as vscode from 'vscode';
import { range, uniq, map, isString } from 'lodash';
import { FromSource, FromSourceZh, ZhToFromSource } from './messages/message';
import { formatActivityMessage, formatActivityTooltipMessage, formatDisplayMessage } from './screen/screen';

export class MessageActivity implements vscode.TreeDataProvider<SourceMessages> {
    private _onDidChangeTreeData: vscode.EventEmitter<SourceMessages | undefined | void> = new vscode.EventEmitter<SourceMessages | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<SourceMessages | undefined | void> = this._onDidChangeTreeData.event;
    private messages: Message[];
    constructor() {
        this.messages = [];
    }

    setResource(messages: Message[]) {
        this.messages = messages;
        this._onDidChangeTreeData.fire();
    }


    getTreeItem(element: SourceMessages): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: any): vscode.ProviderResult<SourceMessages[]> {
        if (element) {
            return this.messages
                .filter(message => message.FromSource === ZhToFromSource[element.content])
                .map((message, index) => new SourceMessages((message.Top ?? index).toString(), message, vscode.TreeItemCollapsibleState.None));
        } else {
            return uniq(map(this.messages, "FromSource")).map(i => new SourceMessages("", FromSourceZh[i], vscode.TreeItemCollapsibleState.Collapsed));
        }
    }

    resolveTreeItem?(item: vscode.TreeItem, element: SourceMessages, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TreeItem> {
        throw new Error('Method not implemented.');
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }
}

export class SourceMessages extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly content: string | Message,
        private readonly collapsi: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsi);
        if (isString(content)) {
            this.iconPath = new vscode.ThemeIcon(`hn-${ZhToFromSource[this.content.toString()]}`);
        }
        this.tooltip = formatActivityTooltipMessage(this.content);
        this.description = formatActivityMessage(this.content);
    }

}