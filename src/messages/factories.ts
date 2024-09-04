import { Message } from "../@types/messageType";
import { BaseMessage, FromSource } from "./message";
import concat from 'lodash/concat';
import { Weibo } from "./weibo";
import { Douyin } from "./douyin";
import { Zhihu } from "./zhihu";
import { loggerInfo } from "../logs/logger";
import { Toutiao } from "./toutiao";
import { slice } from "lodash";

export class MessageFactory {

    private source: FromSource[];

    constructor(source: FromSource[]) {
        this.source = source;
    }

    async factories(): Promise<Message[]> {
        const spiders: BaseMessage[] = this.source.map(source => {
            switch (source) {
                case FromSource.Douyin:
                    return new Douyin();
                case FromSource.Zhihu:
                    return new Zhihu();
                case FromSource.Weibo:
                    return new Weibo();
                case FromSource.Jinritoutiao:
                    return new Toutiao();
                default: return new Douyin();
            }
        });

        let messages: Message[] = [];

        for (let i = 0; i < spiders.length; i++) {
            const spiderMessages = await spiders[i].getMessages();
            loggerInfo(`fetch:${spiders[i].getFromSource()}:length: ${spiderMessages.length}`);
            if (spiderMessages.length > 50) {
                messages = concat(messages, slice(spiderMessages, 0, 50));
            } else {
                messages = concat(messages, spiderMessages);

            }
        }

        return messages;
    }

}