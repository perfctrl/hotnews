import { Message } from "../../@types/messageType";
import { ToutiaoURL } from "../../config";
import { SpiderMessage } from "../abstractSpiderMessage";
import { FromSource } from "../message";

export class Toutiao extends SpiderMessage {
    private url: string = ToutiaoURL;
    getFromSource(): FromSource {
        return FromSource.Jinritoutiao;
    }
    async getMessages(): Promise<Message[]> {
        const response = await this.fetchData(this.url);
        if (!response.ok) {
            return [];
        }
        const data: any = await response.json();
        let messages: Message[] = [];
        if (data.status === "success") {
            let topNo = 0;
            data.data.forEach((item: any) => {
                messages.push({
                    FromSource: this.getFromSource(),
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