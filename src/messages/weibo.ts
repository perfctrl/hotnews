import { Message } from "../messageType";
import { BaseMessage, FromSource } from "./message";

export class Weibo implements BaseMessage {
    private url: string = "https://weibo.com/ajax/statuses/hot_band";
    async getMessages(): Promise<Message[]> {
        const response = await fetch(this.url);
        if (!response.ok) {
            return [];
        }
        const data: any = await response.json();

        let messages: Message[] = [];
        let topNo = 0;
        data.band_list.forEach((item: any) => {
            messages.push({
                FromSource: FromSource.Weibo,
                Title: item.word,
                HotValue: parseInt(item.raw_hot),
                Url: `https://s.weibo.com/weibo?q=${item.word_scheme}t=31`,
                Top: ++topNo
            } as Message);
        });
        return messages;
    }

}