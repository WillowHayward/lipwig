import { CommonEvent } from "./common.model";

export interface BaseCommonMessageData {
    [CommonEvent.RECONNECT]: ReconnectMessageData;
}

export interface ReconnectMessageData {
    code: string;
    id: string;
}

export interface BaseMessageData {
    event: string;
    args: unknown[];
}
