import { Message } from "../../@types/messageType";
import { ZhihuURL } from "../../config";
import { SpiderMessage } from "../abstractSpiderMessage";
import { FromSource } from "../message";
export class Zhihu extends SpiderMessage {
    private url: string = ZhihuURL;

    getFromSource(): FromSource {
        return FromSource.Zhihu;
    }

    async getMessages(): Promise<Message[]> {
        const response = await this.fetchData(this.url);
        if (!response.ok) {
            return [];
        }
        const data: any = await response.json();
        let messages: Message[] = [];
        let topNo = 0;
        data.data.forEach((item: any) => {
            messages.push({
                FromSource: this.getFromSource(),
                Title: item.target.title,
                HotValue: parseInt(item.detail_text) * 10000,
                Url: item.target.url.replace("https://api.zhihu.com/questions", "https://www.zhihu.com/question"),
                Top: ++topNo
            } as Message);
        });
        return messages;
    }

}