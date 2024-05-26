import { BaseClientEvent, JoinOptions } from './client.model';
import { CommonEvent, PingEvent } from '../common';

export interface BaseClientMessageData {
    [BaseClientEvent.JOIN]: JoinMessageData;
    [BaseClientEvent.REJOIN]: RejoinMessageData;
    [CommonEvent.MESSAGE]: MessageMessageData;
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

export interface MessageMessageData {
    event: string;
    args: unknown[];
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
