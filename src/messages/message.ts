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
    Baidu = 'baidu',
    Juejin = 'juejin'
}

export const FromSourceZh: Record<FromSource, string> = {
    [FromSource.Douyin]: '抖音',
    [FromSource.Zhihu]: '知乎',
    [FromSource.Weibo]: '微博',
    [FromSource.Jinritoutiao]: '今日头条',
    [FromSource.Baidu]: '百度',
    [FromSource.Juejin]: '掘金',
};

export const ZhToFromSource: Record<string, FromSource> = Object.entries(FromSource).reduce(
    (acc, [key, value]) => {
        acc[FromSourceZh[value]] = value;
        return acc;
    },
    {} as Record<string, FromSource>
);