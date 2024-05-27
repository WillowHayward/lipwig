import { BaseClientEvent, JoinOptions } from './client.model';
import { CommonEvent, PingEvent } from '../common';

import { BaseMessageData as ClientMessageData } from '../common';

// All client -> server events. Should match keys of ClientMessageData
export const ClientEvent = {
    JOIN: BaseClientEvent.JOIN,
    REJOIN: BaseClientEvent.REJOIN,
    MESSAGE: CommonEvent.MESSAGE,
    POLL_RESPONSE: BaseClientEvent.POLL_RESPONSE,
    PING_SERVER: PingEvent.PING_SERVER,
    PING_HOST: PingEvent.PING_HOST,
    PONG_CLIENT: PingEvent.PONG_CLIENT,
} as const;

export interface ClientEventData {
    [BaseClientEvent.JOIN]: JoinMessageData;
    [BaseClientEvent.REJOIN]: RejoinMessageData;
    [CommonEvent.MESSAGE]: ClientMessageData;
    [BaseClientEvent.POLL_RESPONSE]: PollResponseMessageData;
    [PingEvent.PING_SERVER]: PingServerMessageData;
    [PingEvent.PING_HOST]: PingHostMessageData;
    [PingEvent.PONG_CLIENT]: PongClientMessageData;
}

export interface JoinMessageData {
    code: string;
    options?: JoinOptions;
}

export interface RejoinMessageData {
    code: string;
    id: string;
}

export interface PollResponseMessageData {
    id: string;
    response: unknown;
}

export interface PingHostMessageData {
    time: number;
}

export interface PingServerMessageData {
    time: number;
}

export interface PongClientMessageData {
    time: number;
}
