import { isString } from "lodash";
import { Message } from "../@types/messageType";

export const formatHotValue = (hotValue: number): string => {
    if (hotValue === 0) {
        return "";
    }
    if (hotValue > 10000) {
        return `${Math.ceil(hotValue / 10000)}万`;
    }
    return hotValue.toString();
};

export const formatDisplayMessage = (message: Message): string => {
    let title = message.Title;
    if (title.length > 35) {
        title = title.substring(0, 32) + '...';
    }
    return `$(hn-${message.FromSource})${formatHotValue(message.HotValue)}:$(hn-top-raning):${message.Top ?? ''}:${title}`;
};

export const formatTooltipMessage = (message: Message): string => {
    if (message.Top) {
        return `${message.FromSource}:${message.Top ?? ''}:${formatHotValue(message.HotValue)} ${message.Title}`;
    }
    return `${message.FromSource}:${formatHotValue(message.HotValue)}: ${message.Title}`;
};

export const formatActivityTooltipMessage = (message: Message | string): string => {
    if (isString(message)) {
        return message;
    }
    return `${message.Top ?? ''}:${formatHotValue(message.HotValue)} ${message.Title}`;
};

export const formatActivityMessage = (message: Message | string): string => {
    if (isString(message)) {
        return message;
    }
    let title = message.Title;
    if (title.length > 35) {
        title = title.substring(0, 32) + '...';
    }
    return `${title}  ${formatHotValue(message.HotValue)} `;
};