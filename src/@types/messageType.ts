import { FromSource } from "../messages/message";

export interface Message {
    FromSource: FromSource;
    Title: string;
    HotValue: number;
    Url?: string;
    Top?: number;
}