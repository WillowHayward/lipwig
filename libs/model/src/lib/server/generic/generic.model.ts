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

export enum GenericErrorCode {
    SUCCESS = 'SUCCESS', // TODO: Wait why is this an error?
    MALFORMED = 'MALFORMED',
}

export enum BasePollErrorCode {
    // Poll errors
    POLLALREADYEXISTS = 'POLLALREADYEXISTS', // TODO: Host error?
    POLLCLOSED = 'POLLCLOSED',
    POLLALREADYRESPONSED = 'POLLALREADYRESPONSED',
    POLLUSERNOTFOUND = 'POLLUSERNOTFOUND',
    POLLNOTFOUND = 'POLLNOTFOUND',
    // TODO: Poll already exists
}

export enum BaseHostErrorCode {
    // TODO: USER -> CLIENT?
    USERNOTFOUND = 'USERNOTFOUND',
    LOCALUSEREXISTS = 'LOCALUSEREXISTS',
    LOCALUSERNOTFOUND = 'LOCALUSERNOTFOUND',
}

export enum BaseClientErrorCode {
    INSUFFICIENTPERMISSIONS = 'INSUFFICIENTPERMISSIONS', // TODO: If we add "admin errors", this could apply to hosts as well
}

export enum BaseJoinErrorCode { // TODO: These are distinct from Cliet Errors, yeah?
    // User already in room - TODO: Is this already handled?
    ALREADYCONNECTED = 'ALREADYCONNECTED',
    // Room join errors
    ROOMNOTFOUND = 'ROOMNOTFOUND',
    ROOMFULL = 'ROOMFULL',
    ROOMCLOSED = 'ROOMCLOSED',
    ROOMLOCKED = 'ROOMLOCKED',
    INCORRECTPASSWORD = 'INCORRECTPASSWORD',
    MISSINGPARAM = 'MISSINGPARAM',
    REJECTED = 'REJECTED',
}

export enum BaseRejoinErrorCode {
    // Room rejoin errors
    ALREADYCONNECTED = BaseJoinErrorCode.ALREADYCONNECTED,
    USERNOTFOUND = BaseHostErrorCode.USERNOTFOUND,
}

export type HostErrorCode = BaseHostErrorCode | GenericErrorCode;
export type ClientErrorCode = BaseClientErrorCode | GenericErrorCode;
export type JoinErrorCode = BaseJoinErrorCode | GenericErrorCode;
export type RejoinErrorCode = BaseRejoinErrorCode | GenericErrorCode;
export type PollErrorCode = BasePollErrorCode | GenericErrorCode;
export type ERROR_CODE = HostErrorCode | ClientErrorCode | JoinErrorCode | RejoinErrorCode | PollErrorCode; // TODO: Rename for consistency


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
