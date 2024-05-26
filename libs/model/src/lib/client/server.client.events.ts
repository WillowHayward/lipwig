import { BaseServerClientEvent } from './server.client.model';
import { CommonEvent, ConnectionEvent, PingEvent } from '../common';
import { BaseServerCommonEvent } from '../common/server.common.events';

// Server -> Client events
export interface BaseServerClientConnectionMessageData {
    [BaseServerCommonEvent.ERROR]: never; // TODO
    // Connection
    [ConnectionEvent.JOINED]: JoinedMessageData;
    [ConnectionEvent.REJOINED]: JoinedMessageData;
    [ConnectionEvent.DISCONNECTED]: DisconnectedMessageData;
    [BaseServerClientEvent.HOST_DISCONNECTED]: never;
    [ConnectionEvent.RECONNECTED]: ReconnectedMessageData;
    [BaseServerClientEvent.HOST_RECONNECTED]: HostReconnectedMessageData;
    // Lipwig
    [CommonEvent.MESSAGE]: ServerClientMessageData;
    [BaseServerClientEvent.POLL]: PollMessageData;
    // Ping
    [PingEvent.PONG_CLIENT]: PingClientMessageData;
    [PingEvent.PING_HOST]: PongHostMessageData;
    [PingEvent.PONG_SERVER]: PongServerMessageData;
}

// Connections
export interface JoinedMessageData {
    id: string;
    name?: string;
    data?: Record<string, unknown>;
}

export interface DisconnectedMessageData {
    id: string;
}

export interface ReconnectedMessageData {
    room: string;
    id: string;
}

export interface HostReconnectedMessageData {
    room: string;
    id: string;
}

// Lipwig
export interface ServerClientMessageData {
    event: string;
    args: unknown[];
}

export interface PollMessageData {
    id: string;
    query: string;
}

// Ping
export interface PingClientMessageData {
    time: number;
}

export interface PongHostMessageData {
    time: number;
}

export interface PongServerMessageData {
    time: number;
}
