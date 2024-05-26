import { CommonEvent } from "./common.model";

export type BaseCommonMessageData = {
    [CommonEvent.RECONNECT]: ReconnectMessageData;
}

export interface ReconnectMessageData {
    code: string;
    id: string;
}
