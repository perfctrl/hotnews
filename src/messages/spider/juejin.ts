import { Message } from "../../@types/messageType";
import { JuejinURL, ZhihuURL } from "../../config";
import { SpiderMessage } from "../abstractSpiderMessage";
import { FromSource } from "../message";
export class Juejin extends SpiderMessage {
    private url: string = JuejinURL;

    getFromSource(): FromSource {
        return FromSource.Juejin;
    }

    async getMessages(): Promise<Message[]> {
        const response = await this.fetchData(this.url);
        if (!response.ok) {
            return [];
        }
        const data: any = await response.json();
        if (data.err_no !== 0) {
            return [];
        }
        let messages: Message[] = [];
        let topNo = 0;
        data.data.forEach((item: any) => {
            messages.push({
                FromSource: this.getFromSource(),
                Title: item.content.title,
                HotValue: parseInt(item.content_counter.hot_rank),
                // https://juejin.cn/post/7411799494415728674
                Url: `https://juejin.cn/post/${item.content.content_id}`,
                Top: ++topNo
            } as Message);
        });
        return messages;
    }

}