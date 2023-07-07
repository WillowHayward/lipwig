import { GENERIC_EVENT } from './generic.model';

export interface EventStructure {
    event: GENERIC_EVENT;
}

export interface Query extends EventStructure {
    event: GENERIC_EVENT.QUERY;
    data: QueryData;
}

export interface QueryData {
    room: string;
    id?: string; // For rejoin checking
}

export interface Reconnect extends EventStructure {
    event: GENERIC_EVENT.RECONNECT;
    data: ReconnectData;
}

export interface ReconnectData {
    code: string;
    id: string;
}


export type Event = Query | Reconnect;
export type EventData = QueryData | ReconnectData;
