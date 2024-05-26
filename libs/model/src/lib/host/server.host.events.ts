import { CommonEvent, ConnectionEvent, PingEvent } from "../common";
import { BaseServerHostEvent } from "./server.host.model";

// Server -> Host events
export interface BaseServerHostMessageData {
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
    [CommonEvent.MESSAGE]: MessageMessageData;
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

export interface Left {
    event: BaseServerHostEvent.LEFT;
    data: LeftMessageData;
}

export interface LeftMessageData {
    id: string;
    reason?: string;
}

export interface MessageMessageData {
    event: string;
    sender: string; // Added by server for client -> host messages
    args: unknown[];
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
