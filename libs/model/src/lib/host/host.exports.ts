import { CommonEvent, ConnectionEvent, PingEvent } from "../common";
import { BaseHostEvent } from "./host.model";
import { BaseServerHostEvent } from "./server.host.model";

// TODO: I'm not sure if it'd be worth exporting the Data interfaces individually. Food for thought.
export { BaseHostMessageData as HostMessageData } from "./host.events";
export { BaseServerHostMessageData as ServerHostMessageData } from "./server.host.events";

// All host -> server events. Should match keys of HostMessageData
export enum HostEvent {
    CREATE = BaseHostEvent.CREATE,
    JOIN_RESPONSE = BaseHostEvent.JOIN_RESPONSE,
    LOCK = BaseHostEvent.LOCK,
    UNLOCK = BaseHostEvent.UNLOCK,
    MESSAGE = CommonEvent.MESSAGE,
    KICK = BaseHostEvent.KICK,
    POLL = BaseHostEvent.POLL,
    LOCAL_JOIN = BaseHostEvent.LOCAL_JOIN,
    LOCAL_LEAVE = BaseHostEvent.LOCAL_LEAVE,
    PING_SERVER = PingEvent.PING_SERVER,
    PING_CLIENT = PingEvent.PING_CLIENT,
    PONG_HOST = PingEvent.PONG_HOST,
}

// All server -> host events. Should match keys of ServerHostMessageData
export enum HostServerEvent {
    DISCONNECTED = ConnectionEvent.DISCONNECTED,
    CLIENT_DISCONNECTED = BaseServerHostEvent.CLIENT_DISCONNECTED,
    RECONNECTED = ConnectionEvent.RECONNECTED,
    CLIENT_RECONNECTED = BaseServerHostEvent.CLIENT_RECONNECTED,
    CREATED = ConnectionEvent.CREATED,
    JOINED = ConnectionEvent.JOINED,
    REJOINED = ConnectionEvent.REJOINED,
    JOIN_REQUEST = BaseServerHostEvent.JOIN_REQUEST,
    LEFT = BaseServerHostEvent.LEFT,
    MESSAGE = CommonEvent.MESSAGE,
    POLL_RESPONSE = BaseServerHostEvent.POLL_RESPONSE,
    PING_HOST = PingEvent.PING_HOST,
    PONG_CLIENT = PingEvent.PONG_CLIENT,
    PONG_SERVER = PingEvent.PONG_SERVER,
}
