import { Message } from "../@types/messageType";
import { BaseMessage, FromSource } from "./message";

export class Toutiao implements BaseMessage {
    private url: string = "https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc";
    getFromSource(): FromSource {
        return FromSource.Jinritoutiao;
    }
    async getMessages(): Promise<Message[]> {
        const response = await fetch(this.url);
        if (!response.ok) {
            return [];
        }
        const data: any = await response.json();
        let messages: Message[] = [];
        if (data.status === "success") {
            let topNo = 0;
            data.data.forEach((item: any) => {
                messages.push({
                    FromSource: FromSource.Jinritoutiao,
                    Title: item.Title,
                    HotValue: parseInt(item.HotValue),
                    Url: item.Url,
                    Top: ++topNo
                } as Message);
            });
        }
        return messages;
    }

}