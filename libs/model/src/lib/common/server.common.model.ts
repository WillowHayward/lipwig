// NOTE: I think these are only used for setting the defaults. Fix that.
export interface LipwigOptions {
    port: number;
    roomNumberLimit: number;
    roomSizeLimit: number;
    name: string;
    db: string;
}
asas

export type LipwigConfig = Partial<LipwigOptions>;
export enum SERVER_GENERIC_EVENTS {
    ERROR = 'error',
    QUERY_RESPONSE = 'query-response',
}

export type RoomQuery = Partial<{
    room: string;
    exists: boolean;
    name: string;
    protected: boolean; // Password protected
    capacity: number; // Slots remaining
    locked: boolean;
    lockReason?: string;
    rejoin: boolean; // ID of client for rejoining requests
}>;



// 3000-3999 reserved close codes https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code
export enum CLOSE_CODE {
    KICKED = 3400,
    CLOSED = 3401,
    LEFT = 3402,
    QUERY_COMPLETE = 3403,
}

export enum PING_EVENT {
    PING_SERVER = 'lw-ping-server',
    PONG_SERVER = 'lw-pong-server',
    PING_HOST = 'lw-ping-host',
    PONG_HOST = 'lw-pong-host',
    PING_CLIENT = 'lw-ping-client',
    PONG_CLIENT = 'lw-pong-client',
}
