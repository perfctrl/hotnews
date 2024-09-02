import { Message } from "../messageType";

export interface BaseMessage {
    getMessages(): Promise<Message[]>
}

export enum FromSource {
    Douyin = 'douyin',
    Zhihu = 'zhihu',
    Weibo = 'weibo'
}