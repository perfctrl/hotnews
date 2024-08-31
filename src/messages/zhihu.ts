import { Message } from "../messageType";
import { BaseMessage, FromSource } from "./message";

export class Zhihu implements BaseMessage {
    private url: string = "https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total";
    async getMessages(): Promise<Message[]> {
        const response = await fetch(this.url);
        if (!response.ok) {
            return [];
        }
        const data: any = await response.json();
        let messages: Message[] = [];
        let topNo = 0;
        data.data.forEach((item: any) => {
            messages.push({
                FromSource: FromSource.Zhihu,
                Title: item.target.title,
                HotValue: parseInt(item.detail_text) * 10000,
                Url: item.target.url.replace("https://api.zhihu.com/questions", "https://www.zhihu.com/question"),
                Top: ++topNo
            } as Message);
        });
        return messages;
    }

}