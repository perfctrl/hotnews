import { Message } from './../../@types/messageType';
import { SpiderMessage } from "../abstractSpiderMessage";
import { FromSource } from "../message";
import { WeiboURL } from '../../config';

export class Weibo extends SpiderMessage {
    private url: string = WeiboURL;
    getFromSource(): FromSource {
        return FromSource.Weibo;
    }
    async getMessages(): Promise<Message[]> {
        const response = await this.fetchData(this.url);
        if (!response.ok) {
            response.statusText;
            return [];
        }
        const data: any = await response.json();

        let messages: Message[] = [];
        let topNo = 0;
        data.data.band_list.forEach((item: any) => {
            const isAd = item.is_ad ?? undefined;
            messages.push({
                FromSource: this.getFromSource(),
                Title: item.word,
                HotValue: isAd ? 0 : parseInt(item.num),
                Url: `https://s.weibo.com/weibo?q=${item.word_scheme}t=31`,
                Top: ++topNo
            } as Message);
        });
        return messages;
    }

}