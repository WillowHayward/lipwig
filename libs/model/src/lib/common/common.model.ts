export const MESSAGE_EVENT = 'lw-message';
export const ERROR_EVENT = 'error';

export const CommonEvent = {
    RECONNECT: 'reconnect',
    MESSAGE: MESSAGE_EVENT,
} as const;

// Common events used to establish, re-establish, or terminate a connection
export const ConnectionEvent = {
    CREATED: 'created',
    JOINED: 'joined',
    REJOINED: 'rejoined',
    DISCONNECTED: 'disconnected',
    RECONNECTED: 'reconnected',
} as const;

// TODO: Divide this up
export const PingEvent = {
    PING_SERVER: 'lw-ping-server',
    PONG_SERVER: 'lw-pong-server',
    PING_HOST: 'lw-ping-host',
    PONG_HOST: 'lw-pong-host',
    PING_CLIENT: 'lw-ping-client',
    PONG_CLIENT: 'lw-pong-client',
} as const;

export interface BaseMessage {
    event: string;
}


