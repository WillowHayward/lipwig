import { API_LOG_EVENT, LOG_TYPE, ROOM_LOG_EVENT, SOCKET_LOG_EVENT } from "@lipwig/model";

export enum MESSAGE_DIRECTION {
    TO = 0,
    FROM = 1
}

export interface GenericLog {
    type: LOG_TYPE;
    event: string;
    subevent?: string;
    data?: string;
}

export interface RoomLog extends GenericLog {
    event: ROOM_LOG_EVENT;
    id: string;
}

export interface SocketLog extends GenericLog {
    event: SOCKET_LOG_EVENT;
    id: string;
    room?: string;
}

export interface ApiLog extends GenericLog {
    event: API_LOG_EVENT
}
