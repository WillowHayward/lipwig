import { SOCKET_TYPE } from "../socket";

export enum MESSAGE_DIRECTION {
    TO = 0,
    FROM = 1
}

export interface RoomLog {
    message: string;
    event: string;
    subevent?: string;
    id: string;
}

export interface SocketLog extends RoomLog {
    type: SOCKET_TYPE;
    room?: string;
}
