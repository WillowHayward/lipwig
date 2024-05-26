export enum CommonEvent {
    RECONNECT = 'reconnect',
    MESSAGE = 'lw-message',
}

// Common events used to establish, re-establish, or terminate a connection
export enum ConnectionEvent {
    CREATED = 'created',
    JOINED = 'joined',
    REJOINED = 'rejoined',
    DISCONNECTED = 'disconnected',
    RECONNECTED = 'reconnected',
}

// TODO: Divide this up
export enum PingEvent {
    PING_SERVER = 'lw-ping-server',
    PONG_SERVER = 'lw-pong-server',
    PING_HOST = 'lw-ping-host',
    PONG_HOST = 'lw-pong-host',
    PING_CLIENT = 'lw-ping-client',
    PONG_CLIENT = 'lw-pong-client',
}

export interface BaseMessage {
    event: string;
}
