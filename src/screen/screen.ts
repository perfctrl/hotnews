import { Message } from "../@types/messageType";

export const formatHotValue = (hotValue: number): string => {
    if (hotValue > 10000) {
        return `${Math.ceil(hotValue / 10000)}万`;
    } else if (hotValue > 1000) {
        return `${Math.ceil(hotValue / 1000)}千`;
    }
    return hotValue.toString();
};

export const formatDisplayMessage = (message: Message): string => {
    let title = message.Title;
    if (title.length > 35) {
        title = title.substring(0, 32) + '...';
    }
    // return `${message.FromSource}:热度:${formatHotValue(message.HotValue)} ${title}`;
    return `${message.FromSource}:$(arrow-up):${message.Top ?? ''}:热度:${formatHotValue(message.HotValue)}:${title}`;
};

export const formatTooltipMessage = (message: Message): string => {
    if (message.Top) {
        return `${message.FromSource}:top:${message.Top ?? ''}:热度:${formatHotValue(message.HotValue)} ${message.Title}`;
    }
    return `${message.FromSource}:热度:${formatHotValue(message.HotValue)}: ${message.Title}`;
};