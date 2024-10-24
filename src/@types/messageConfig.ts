import { FromSource } from "../messages/message";

export interface MsgConfig {
    scrollSpeed: number;
    msgSource: FromSource[];
    interval: number;
    position: any;
    offset: number;
}