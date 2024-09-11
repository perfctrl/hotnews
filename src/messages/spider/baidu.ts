import { Message } from "../../@types/messageType";
import { BaiduURL } from "../../config";
import { SpiderMessage } from "../abstractSpiderMessage";
import { FromSource } from "../message";
import load from "cheerio";

export class Baidu extends SpiderMessage {
    private url: string = BaiduURL;
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

    // async fetchMessages(): Promise<Message[]> {
    //     const response = await this.fetchData("https://top.baidu.com/board?tab=realtime");
    //     if (!response.ok) {
    //         return [];
    //     }
    //     const data: string = await response.text();
    //     const $ = load(data);
    //     let messages: Message[] = [];
    //      @todo
    //     return messages;

    // };

}