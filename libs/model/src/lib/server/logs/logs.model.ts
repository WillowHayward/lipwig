
export enum LOG_TYPE {
    ROOM = 'ROOM',
    ANONYMOUS = 'ANON',
    HOST = 'HOST',
    CLIENT = 'CLNT',
    ADMIN = 'ADMN'
}

export enum ROOM_LOG_EVENT {
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

export enum SOCKET_LOG_EVENT {
    INITIALIZED = 'initialized',
    DISCONNECTED = 'disconnected',
    CLEANUP = 'cleaning-up',
    ERROR = 'error',
    SENDING = 'sending',
    RECEIVED = 'received', // TODO - implement
}
