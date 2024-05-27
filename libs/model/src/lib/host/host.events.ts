import { BaseHostEvent, CreateOptions } from './host.model';
import { CommonEvent, PingEvent } from '../common';
import { BaseMessageData } from '../common/common.events';

// All host -> server events. Should match keys of HostMessageData
export const HostEvent = {
    CREATE: BaseHostEvent.CREATE,
    JOIN_RESPONSE: BaseHostEvent.JOIN_RESPONSE,
    LOCK: BaseHostEvent.LOCK,
    UNLOCK: BaseHostEvent.UNLOCK,
    MESSAGE: CommonEvent.MESSAGE,
    KICK: BaseHostEvent.KICK,
    POLL: BaseHostEvent.POLL,
    LOCAL_JOIN: BaseHostEvent.LOCAL_JOIN,
    LOCAL_LEAVE: BaseHostEvent.LOCAL_LEAVE,
    PING_SERVER: PingEvent.PING_SERVER,
    PING_CLIENT: PingEvent.PING_CLIENT,
    PONG_HOST: PingEvent.PONG_HOST,
} as const;


export interface HostEventData {
    [BaseHostEvent.CREATE]: CreateMessageData,
    [BaseHostEvent.JOIN_RESPONSE]: JoinResponseMessageData,
    [BaseHostEvent.LOCK]: LockMessageData,
    [BaseHostEvent.UNLOCK]: never,
    [CommonEvent.MESSAGE]: HostMessageData,
    [BaseHostEvent.KICK]: KickMessageData,
    [BaseHostEvent.POLL]: PollMessageData,
    [BaseHostEvent.LOCAL_JOIN]: LocalJoinMessageData,
    [BaseHostEvent.LOCAL_LEAVE]: LocalLeaveMessageData,
    [PingEvent.PING_SERVER]: PingServerMessageData,
    [PingEvent.PING_CLIENT]: PingClientMessageData,
    [PingEvent.PONG_HOST]: PongHostMessageData,
}

export interface CreateMessageData {
    config?: CreateOptions;
}

export interface JoinResponseMessageData {
    id: string;
    response: boolean;
    reason?: string;
}

export interface LockMessageData {
    reason?: string;
}

export interface HostMessageData extends BaseMessageData {
    recipients: string[];
}

export interface PollMessageData {
    id: string;
    recipients: string[];
    query: string;
}

export interface KickMessageData {
    id: string;
    reason?: string;
}

export interface LocalJoinMessageData {
    id: string;
}

export interface LocalLeaveMessageData {
    id: string;
}

export interface PingServerMessageData {
    time: number;
}

export interface PingClientMessageData {
    time: number;
    id: string;
}

export interface PongHostMessageData {
    time: number;
    id: string;
}
