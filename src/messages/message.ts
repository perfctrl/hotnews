import { Message } from "../@types/messageType";

export interface BaseMessage {
    getMessages(): Promise<Message[]>
    getFromSource(): FromSource;
}

export enum FromSource {
    Douyin = 'douyin',
    Zhihu = 'zhihu',
    Weibo = 'weibo',
    Jinritoutiao = 'jinritoutiao',
    Baidu = 'baidu'
}