import { CommonEvent, ConnectionEvent, PingEvent } from "../common";
import { BaseServerCommonEvent } from "../common/server.common.events";
import { BaseClientEvent } from "./client.model";
import { BaseServerClientEvent } from "./server.client.model";

// TODO: I'm not sure if it'd be worth exporting the Data interfaces individually. Food for thought.
export { BaseClientMessageData as ClientMessageData } from "./client.events";
export { BaseServerClientMessageData as ServerClientMessageData } from "./server.client.events";

// All client -> server events. Should match keys of ClientMessageData
export enum ClientEvent {
    JOIN = BaseClientEvent.JOIN,
    REJOIN = BaseClientEvent.REJOIN,
    MESSAGE = CommonEvent.MESSAGE,
    POLL_RESPONSE = BaseClientEvent.POLL_RESPONSE,
    PING_SERVER = PingEvent.PING_SERVER,
    PING_HOST = PingEvent.PING_HOST,
    PONG_CLIENT = PingEvent.PONG_CLIENT,
}

// All server -> client events. Should match keys of ServerClientMessageData
export enum ServerClientEvent {
    ERROR = BaseServerCommonEvent.ERROR,
    JOINED = ConnectionEvent.JOINED,
    REJOINED = ConnectionEvent.REJOINED,
    DISCONNECTED = ConnectionEvent.DISCONNECTED,
    HOST_DISCONNECTED = BaseServerClientEvent.HOST_DISCONNECTED,
    RECONNECTED = ConnectionEvent.RECONNECTED,
    HOST_RECONNECTED = BaseServerClientEvent.HOST_RECONNECTED,
    MESSAGE = CommonEvent.MESSAGE,
    POLL = BaseServerClientEvent.POLL,
    PONG_CLIENT = PingEvent.PONG_CLIENT,
    PING_HOST = PingEvent.PING_HOST,
    PONG_SERVER = PingEvent.PONG_SERVER,
}


