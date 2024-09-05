import { Message } from './../@types/messageType';
import { BaseMessage, FromSource } from "./message";
import concat from 'lodash/concat';
import { loggerError, loggerInfo, loggerWarn } from "../logs/logger";
import { reject, slice } from "lodash";
import { Douyin, Toutiao, Weibo, Zhihu } from './spider';

export class MessageFactory {

    private source: FromSource[];

    constructor(source: FromSource[]) {
        this.source = source;
    }

    async factories(): Promise<Message[]> {

        const allSpiders = {
            [FromSource.Douyin]: new Douyin(),
            [FromSource.Zhihu]: new Zhihu(),
            [FromSource.Weibo]: new Weibo(),
            [FromSource.Jinritoutiao]: new Toutiao(),
        };
        const spiders: BaseMessage[] = this.source.map(source => allSpiders[source]);

        let messages: Message[] = [];

        const spiderPromises = spiders.map(async spider => {
            try {
                const spiderMessages = await spider.getMessages();
                loggerInfo(`fetch:${spider.getFromSource()}:length: ${spiderMessages.length}`);
                return spiderMessages.length > 50 ? slice(spiderMessages, 0.50) : spiderMessages;
            } catch (error) {
                loggerError(`Error fetching messages from ${spider.getFromSource()}: ${error}`);
                throw error;
            }
        });

        const results = await Promise.allSettled(spiderPromises);
        results.forEach(result => {
            loggerInfo(666, result);
            if (result.status === 'fulfilled') {
                messages = concat(messages, result.value);
            }
        });
        return messages;
    }

}