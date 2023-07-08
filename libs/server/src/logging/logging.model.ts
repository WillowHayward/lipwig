import { SOCKET_TYPE } from "../socket";

export enum MESSAGE_DIRECTION {
    TO = 0,
    FROM = 1
}

interface Log {
    message: string;
    event: string;
    subevent?: string;
}

export interface RoomLog extends Log {
    roomId: string; // TODO: Switch to number to use entity relationship
}

export interface SocketLog extends Log {
    socketId: string;
    type: SOCKET_TYPE;
    roomId?: string;
}
