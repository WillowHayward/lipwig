import { Joined, JoinedData, Rejoined, Message, MessageData, Poll } from './lipwig.model';
import {
    Disconnected,
    HostDisconnected,
    Reconnected,
    ReconnectedData,
    HostReconnected,
    DisconnectedData,
    HostReconnectedData,
} from './connection.model';
import {
    PingClient,
    PingClientData,
    PongHost,
    PongHostData,
    PongServer,
    PongServerData,
} from './ping.model';

export * from './lipwig.model';
export * from './connection.model';
export * from './ping.model';

export type Event =
    // Lipwig Events
    | Joined
    | Rejoined
    | Message
    | Poll
    // Connection Events
    | Disconnected
    | HostDisconnected
    | Reconnected
    | HostReconnected
    // Ping Events
    | PingClient
    | PongHost
    | PongServer;

export type EventData =
    // Lipwig Events
    | JoinedData
    | MessageData
    // Connection Events
    | DisconnectedData
    | ReconnectedData
    | HostReconnectedData
    // Ping Events
    | PingClientData
    | PongHostData
    | PongServerData;
