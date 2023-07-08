import * as WebSocket from 'ws';
import type { AnonymousSocket } from './anonymous.socket';
import type { HostSocket } from './host.socket';
import type { ClientSocket } from './client.socket';
import type { AdminSocket } from './admin.socket';

export declare class LipwigSocket extends WebSocket {
    socket: AnonymousSocket | HostSocket | ClientSocket | AdminSocket;
}
