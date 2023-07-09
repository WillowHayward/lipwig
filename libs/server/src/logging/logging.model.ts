import { LOG_TYPE, ROOM_LOG_EVENT, SOCKET_LOG_EVENT } from "@lipwig/model";

export enum MESSAGE_DIRECTION {
    TO = 0,
    FROM = 1
}

export interface GenericLog {
    type: LOG_TYPE;
    event: string;
    subevent?: string;
    data?: string;
    id: string;
}

export interface RoomLog extends GenericLog {
    event: ROOM_LOG_EVENT;
}

export interface SocketLog extends GenericLog {
    event: SOCKET_LOG_EVENT;
    room?: string;
}
