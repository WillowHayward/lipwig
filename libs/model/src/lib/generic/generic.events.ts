import { GENERIC_EVENT } from './generic.model';

export interface EventStructure {
    event: GENERIC_EVENT;
}

export interface Reconnect extends EventStructure {
    event: GENERIC_EVENT.RECONNECT;
    data: ReconnectData;
}

export interface ReconnectData {
    code: string;
    id: string;
}


export type Event = Reconnect;
export type EventData = ReconnectData;
