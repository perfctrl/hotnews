import { Message } from "../@types/messageType";
import { loggerInfo } from "../logs/logger";
import { BaseMessage, FromSource } from "./message";

export class Weibo implements BaseMessage {
    private url: string = "https://weibo.com/ajax/statuses/hot_band";
    getFromSource(): FromSource {
        return FromSource.Weibo;
    }
    async getMessages(): Promise<Message[]> {
        const response = await fetch(this.url);
        if (!response.ok) {
            return [];
        }
        const data: any = await response.json();
        loggerInfo(data);

        let messages: Message[] = [];
        let topNo = 0;
        data.data.band_list.forEach((item: any) => {
            const isAd = item.is_ad ?? undefined;
            messages.push({
                FromSource: FromSource.Weibo,
                Title: item.word,
                HotValue: isAd ? 0 : parseInt(item.num),
                Url: `https://s.weibo.com/weibo?q=${item.word_scheme}t=31`,
                Top: ++topNo
            } as Message);
        });
        return messages;
    }

}