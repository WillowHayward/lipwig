
import { HOST_EVENT } from "../host";

export enum GENERIC_EVENT {
    RECONNECT = 'reconnect',
    MESSAGE = 'lw-message',
}

export interface BaseEvent {
    event: string;
}
