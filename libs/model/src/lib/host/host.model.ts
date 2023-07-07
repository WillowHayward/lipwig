/**
 *
 * @author: Willow Hayward, whc.fyi
 */
import { GENERIC_EVENT } from '../generic';
import { PING_EVENT } from '../server';

export type CreateOptions = Partial<{
    size: number;
    name: string;
    password: string;
    approvals: boolean; // True for Host manually approving join requests
    required: string[]; // List of required paramaters to join a room
}>;

// Events sent from a Host to the Server
export enum HOST_EVENT {
    CREATE = 'create',
    JOIN_RESPONSE = 'join-response',
    LOCK = 'lock',
    UNLOCK = 'unlock',
    MESSAGE = GENERIC_EVENT.MESSAGE,
    POLL = 'poll',
    KICK = 'lw-kick',
    RECONNECT = 'reconnect',
    LOCAL_JOIN = 'lw-local-join', // Used to register local client
    LOCAL_LEAVE = 'lw-local-leave', // Used to remove local client
    PING_SERVER = PING_EVENT.PING_SERVER,
    PING_CLIENT = PING_EVENT.PING_CLIENT,
    PONG_HOST = PING_EVENT.PONG_HOST,
}
