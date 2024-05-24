import { GENERIC_EVENT } from '../generic';
import { PING_EVENT } from '../server';

export const DEFAULTS = {
    port: 8989, //TODO: Is this needed?
};

export type JoinOptions = Partial<{
    data: Record<string, unknown>;
    password: string;
}>;

export enum CLIENT_EVENT {
    JOIN = 'join',
    REJOIN = 'rejoin',
    MESSAGE = GENERIC_EVENT.MESSAGE,
    POLL_RESPONSE = 'poll-response',
    RECONNECT = 'reconnect',
    PING_HOST = PING_EVENT.PING_HOST,
    PING_SERVER = PING_EVENT.PING_SERVER,
    PONG_CLIENT = PING_EVENT.PONG_CLIENT,
}

