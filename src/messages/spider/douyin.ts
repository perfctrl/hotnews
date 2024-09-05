import { Message } from "../../@types/messageType";
import { SpiderMessage } from "../abstractSpiderMessage";
import { FromSource } from "../message";

export class Douyin extends SpiderMessage {
    private url: string = "https://www.iesdouyin.com/web/api/v2/hotsearch/billboard/word/";
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
                    FromSource: FromSource.Douyin,
                    Title: item.word,
                    HotValue: item.hot_value,
                    Top: ++topNo
                } as Message);
            });
        }
        return messages;
    }

}