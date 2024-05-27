import { BaseServerClientEvent } from './server.client.model';
import { CommonEvent, ConnectionEvent, PingEvent } from '../common';
import { BaseServerCommonEvent, ErrorMessageData } from '../common/server.common.events';

import { ClientError } from './client.errors';

import { BaseMessageData as ServerClientMessageData } from '../common/common.events';


// All server -> client events. Should match keys of ServerClientMessageData
export const ServerClientEvent = {
    ERROR: BaseServerCommonEvent.ERROR,
    JOINED: ConnectionEvent.JOINED,
    REJOINED: ConnectionEvent.REJOINED,
    DISCONNECTED: ConnectionEvent.DISCONNECTED,
    HOST_DISCONNECTED: BaseServerClientEvent.HOST_DISCONNECTED,
    RECONNECTED: ConnectionEvent.RECONNECTED,
    HOST_RECONNECTED: BaseServerClientEvent.HOST_RECONNECTED,
    MESSAGE: CommonEvent.MESSAGE,
    POLL: BaseServerClientEvent.POLL,
    PONG_CLIENT: PingEvent.PONG_CLIENT,
    PING_HOST: PingEvent.PING_HOST,
    PONG_SERVER: PingEvent.PONG_SERVER,
} as const;

// Server -> Client events
export interface ServerClientEventData {
    [BaseServerCommonEvent.ERROR]: ErrorMessageData<typeof ClientError>; // TODO
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
