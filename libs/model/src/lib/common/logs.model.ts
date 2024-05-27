
// TODO: Consider moving these to `as const` as well
// TODO: This is currently only used for logging in the server. js logging should be transitioned to use this too
export enum LogType {
    ROOM = 'ROOM',
    ANONYMOUS = 'ANON',
    HOST = 'HOST',
    CLIENT = 'CLNT',
    ADMIN = 'ADMN',
    API = 'API',
}

export enum RoomLogEvent {
    CREATED = 'created',
    LOCKED = 'locked',
    UNLOCKED = 'unlocked',
    CLOSED = 'closed',

    HOST_DISCONNECTED = 'host-disconnected',
    HOST_RECONNECTED = 'host-reconnected',
    HOST_MESSAGE = 'host-message',

    JOIN_REQUEST = 'join-request',
    CLIENT_JOINED = 'client-joined',
    CLIENT_REJOINED = 'client-rejoined',
    CLIENT_RECONNECTED = 'client-reconnected',
    CLIENT_LEFT = 'client-left',
    CLIENT_KICKED = 'client-kicked',
    CLIENT_MESSAGE = 'client-message',

    LOCAL_JOINED = 'local-joined',
    LOCAL_LEFT = 'local-left'
}

export enum SocketLogEvent {
    INITIALIZED = 'initialized',
    DISCONNECTED = 'disconnected',
    CLEANUP = 'cleaning-up',
    ERROR = 'error',
    SENDING = 'sending',
    RECEIVED = 'received', // TODO - implement
}

export enum ApiLogEvent {
    GET = 'get',
}
