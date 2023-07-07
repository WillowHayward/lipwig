import * as WSSocket from 'ws';
import type { UninitializedSocket } from './classes/UninitializedSocket';
import type { HostSocket } from '../lipwig/classes/HostSocket';
import type { ClientSocket } from '../lipwig/classes/ClientSocket';
import type { AdminSocket } from '../admin/classes/AdminSocket';

export declare class WebSocket extends WSSocket {
    socket: UninitializedSocket | HostSocket | ClientSocket | AdminSocket;
}

// TODO: Expand beyond 4 letter words?
export const BANNED_WORDS = ['SHIT', 'FUCK', 'CUNT', 'COCK', 'RAPE', 'PISS', 'JIZZ', 'DICK', 'DYKE', 'SHAG', 'POOP', 'SLUT', 'TURD', 'GOOK', 'COON', 'SPIC', 'CRAP', 'HELL', 'WANK', 'MONG', 'TWAT', 'TITS', 'SLAG'];

export enum SOCKET_TYPE {
    UNINITIALIZED,
    HOST,
    CLIENT,
    ADMIN
}
