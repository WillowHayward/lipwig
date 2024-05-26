// NOTE: I think these are only used for setting the defaults. Fix that.
export interface LipwigOptions {
    port: number;
    roomNumberLimit: number;
    roomSizeLimit: number;
    name: string;
    db: string;
}

export type LipwigConfig = Partial<LipwigOptions>;
export enum ServerCommonEvent {
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
