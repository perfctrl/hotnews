import { Message } from '../@types/messageType';
import { getUserAgent } from '../other/userAgent';
import { BaseMessage, FromSource } from './message';
export abstract class SpiderMessage implements BaseMessage {
    abstract getMessages(): Promise<Message[]>;
    abstract getFromSource(): FromSource;
    async fetchData(url: string) {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "User-Agent": getUserAgent(),
            }
        });
        return response;
    };
}