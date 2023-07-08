import * as WSSocket from 'ws';
import type { AnonymousSocket } from './classes/AnonymousSocket';
import type { HostSocket } from '../lipwig/classes/HostSocket';
import type { ClientSocket } from '../lipwig/classes/ClientSocket';
import type { Admin } from '../admin/classes/Admin';

export declare class WebSocket extends WSSocket {
    socket: AnonymousSocket | HostSocket | ClientSocket | Admin;
}

// TODO: Expand beyond 4 letter words?
export const BANNED_WORDS = ['SHIT', 'FUCK', 'CUNT', 'COCK', 'RAPE', 'PISS', 'JIZZ', 'DICK', 'DYKE', 'SHAG', 'POOP', 'SLUT', 'TURD', 'GOOK', 'COON', 'SPIC', 'CRAP', 'HELL', 'WANK', 'MONG', 'TWAT', 'TITS', 'SLAG'];

export enum SOCKET_TYPE {
    UNINITIALIZED = 'Socket',
    HOST = 'Host',
    CLIENT = 'Client',
    ADMIN = 'Admin'
}

