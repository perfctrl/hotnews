import { Message } from "../../@types/messageType";
import { DouyinURL } from "../../config";
import { SpiderMessage } from "../abstractSpiderMessage";
import { FromSource } from "../message";

export class Douyin extends SpiderMessage {
    private url: string = DouyinURL;
    getFromSource(): FromSource {
        return FromSource.Douyin;
    }
    async getMessages(): Promise<Message[]> {
        const response = await this.fetchData(this.url);
        if (!response.ok) {
            return [];
        }
        const data: any = await response.json();
        let messages: Message[] = [];
        if (data.status_code === 0) {
            let topNo = 0;
            data.word_list.forEach((item: any) => {
                messages.push({
                    FromSource: this.getFromSource(),
                    Title: item.word,
                    HotValue: item.hot_value,
                    Top: ++topNo
                } as Message);
            });
        }
        return messages;
    }

}