import { Message } from "../../@types/messageType";
import { SpiderMessage } from "../abstractSpiderMessage";
import { FromSource } from "../message";

export class Baidu extends SpiderMessage {
    private url: string = "https://api.rebang.today/v1/items?tab=baidu&sub_tab=realtime&version=1";
    getFromSource(): FromSource {
        return FromSource.Baidu;
    }
    async getMessages(): Promise<Message[]> {
        const response = await this.fetchData(this.url);
        if (!response.ok) {
            return [];
        }
        const data: any = await response.json();
        let messages: Message[] = [];
        const list = JSON.parse(data.data.list);
        if (list.length > 0) {
            let topNo = 0;
            list.forEach((item: any) => {
                messages.push({
                    FromSource: this.getFromSource(),
                    Title: item.word,
                    HotValue: parseInt(item.hot_score),
                    Url: `https://www.baidu.com/s?wd=${item.word}`,
                    Top: ++topNo
                } as Message);
            });
        }
        return messages;
    }

}