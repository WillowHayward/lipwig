import { PING_EVENT } from '../common.model';

export const DEFAULTS = {
    port: 8989,
};

export enum CLIENT_EVENT {
    JOIN = 'join',
    REJOIN = 'rejoin',
    MESSAGE = 'lw-message',
    POLL_RESPONSE = 'poll-response',
    RECONNECT = 'reconnect',
    PING_HOST = PING_EVENT.PING_HOST,
    PING_SERVER = PING_EVENT.PING_SERVER,
    PONG_CLIENT = PING_EVENT.PONG_CLIENT,
}
