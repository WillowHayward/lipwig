import { CommonEvent, ConnectionEvent, PingEvent } from "../common";
import { BaseServerCommonEvent, ErrorMessageData } from "../common/server.common.events";
import { BaseServerHostEvent } from "./server.host.model";
import { BaseMessageData } from '../common/common.events';
import { HostError } from "./host.errors";

// All server -> host events. Should match keys of ServerHostMessageData
export const ServerHostEvent = {
    ERROR: BaseServerCommonEvent.ERROR,
    DISCONNECTED: ConnectionEvent.DISCONNECTED,
    CLIENT_DISCONNECTED: BaseServerHostEvent.CLIENT_DISCONNECTED,
    RECONNECTED: ConnectionEvent.RECONNECTED,
    CLIENT_RECONNECTED: BaseServerHostEvent.CLIENT_RECONNECTED,
    CREATED: ConnectionEvent.CREATED,
    JOINED: ConnectionEvent.JOINED,
    REJOINED: ConnectionEvent.REJOINED,
    JOIN_REQUEST: BaseServerHostEvent.JOIN_REQUEST,
    LEFT: BaseServerHostEvent.LEFT,
    MESSAGE: CommonEvent.MESSAGE,
    POLL_RESPONSE: BaseServerHostEvent.POLL_RESPONSE,
    PING_HOST: PingEvent.PING_HOST,
    PONG_CLIENT: PingEvent.PONG_CLIENT,
    PONG_SERVER: PingEvent.PONG_SERVER,
} as const;

export interface ServerHostEventData {
    [BaseServerCommonEvent.ERROR]: ErrorMessageData<typeof HostError>; // TODO
    // Connections
    [ConnectionEvent.DISCONNECTED]: never;
    [BaseServerHostEvent.CLIENT_DISCONNECTED]: ClientDisconnectedMessageData;
    [ConnectionEvent.RECONNECTED]: ReconnectedMessageData;
    [BaseServerHostEvent.CLIENT_RECONNECTED]: ClientReconnectedMessageData;
    // Lipwig
    [ConnectionEvent.CREATED]: CreatedMessageData;
    [ConnectionEvent.JOINED]: JoinedMessageData;
    [ConnectionEvent.REJOINED]: RejoinedMessageData;
    [BaseServerHostEvent.JOIN_REQUEST]: JoinRequestMessageData;
    [BaseServerHostEvent.LEFT]: LeftMessageData;
    [CommonEvent.MESSAGE]: ServerHostMessageData;
    [BaseServerHostEvent.POLL_RESPONSE]: PollResponseMessageData;
    // Ping
    [PingEvent.PING_HOST]: PingHostData;
    [PingEvent.PONG_CLIENT]: PongClientData;
    [PingEvent.PONG_SERVER]: PongServerData;
}

export interface ClientDisconnectedMessageData {
    id: string;
}

export interface ReconnectedMessageData {
    room: string;
    id: string;
    users?: string[]; // Array of user ids
    local?: string[]; // Array of local user ids
}

export interface ClientReconnectedMessageData {
    room: string;
    id: string;
}

// Lipwig
export interface CreatedMessageData {
    code: string;
    id: string;
}

export interface JoinedMessageData {
    id: string;
    data?: Record<string, unknown>;
}

export interface RejoinedMessageData {
    id: string;
}

export interface JoinRequestMessageData {
    id: string;
    data?: Record<string, unknown>;
}

export interface LeftMessageData {
    id: string;
    reason?: string;
}

export interface ServerHostMessageData extends BaseMessageData {
    sender: string; // Added by server for client -> host messages
}

export interface PollResponseMessageData {
    id: string;
    client: string;
    response: unknown;
}

// Ping
export interface PingHostData {
    time: number;
    id: string;
}

export interface PongClientData {
    time: number;
    id: string;
}

export interface PongServerData {
    time: number;
}
