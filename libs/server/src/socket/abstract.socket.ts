import { CLOSE_CODE, ERROR_CODE, LOG_TYPE, SERVER_GENERIC_EVENTS, SOCKET_LOG_EVENT, ServerAdminEvents, ServerClientEvents, ServerGenericEvents, ServerHostEvents } from '@lipwig/model';
import { SOCKET_TYPE } from './socket.model';
import { LipwigSocket } from './lipwig.socket';
import { LipwigLogger } from '../logging/logger/lipwig.logger';
import { Room } from '../room/room.instance';

type Callback = (...args: any[]) => void;

export abstract class AbstractSocket {
    private events: Record<string, Callback[]> = {};

    public connected = false;

    private callbacks: {
        close: (code: CLOSE_CODE) => void;
        message: (data: Buffer) => void;
    };

    constructor(public socket: LipwigSocket, public id: string, public type: SOCKET_TYPE, protected logger: LipwigLogger, public room?: Room) {
        this.connected = true;
        if (socket.socket) {
            socket.socket.cleanup(id);
        }
        //TODO: Set socket.socket here?
        this.setInternalListeners();
        this.setListeners();

        const socketTypeMessages = {
            [SOCKET_TYPE.ANONYMOUS]: 'Anonymous Socket',
            [SOCKET_TYPE.HOST]: 'Host Socket',
            [SOCKET_TYPE.CLIENT]: 'Client Socket',
            [SOCKET_TYPE.ADMIN]: 'Admin Socket',
        };

        const message = socketTypeMessages[this.type];

        this.log(SOCKET_LOG_EVENT.INITIALIZED, message);
    }

    protected abstract setListeners(): void;

    error(error: ERROR_CODE, message = '') {
        this.log(SOCKET_LOG_EVENT.ERROR, message, error);

        const errorMessage: ServerGenericEvents.Error = {
            event: SERVER_GENERIC_EVENTS.ERROR,
            data: {
                error,
                message,
            },
        };
        this.send(errorMessage);
    }

    send(
        message: ServerHostEvents.Event
            | ServerClientEvents.Event
            | ServerGenericEvents.Event
            | ServerAdminEvents.Event
    ) {
        let messageEvent: string | undefined;
        if (message.event === 'lw-message') { // TODO: Move to enum
            messageEvent = message.data.event;
        }
        this.log(SOCKET_LOG_EVENT.SENDING, messageEvent, message.event);
        const messageString = JSON.stringify(message);
        this.socket.send(messageString);
    }

    close(code: CLOSE_CODE, reason?: string) {
        this.socket.close(code, reason);
    }

    on(event: string, callback: (...args: any[]) => void): void {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    emit(event: string, ...args: any[]) {
        const callbacks = this.events[event] || [];
        for (const callback of callbacks) {
            callback(...args);
        }
    }

    private setInternalListeners() {
        this.callbacks = {
            close: (code: CLOSE_CODE) => {
                let message = code.toString();
                if (code >= 3000) {
                    const reason = CLOSE_CODE[code];
                    message += ` (${reason})`;
                }
                this.log(SOCKET_LOG_EVENT.DISCONNECTED, message);
            },
            message: (data: Buffer) => {
                try {
                    const parsed = JSON.parse(data.toString('utf8'));
                    if (parsed.event) {
                        this.log(SOCKET_LOG_EVENT.RECEIVED, undefined, parsed.event);
                    } else {
                        throw new Error(); // Catch
                    }
                } catch {
                    this.log(SOCKET_LOG_EVENT.RECEIVED, 'Could not parse message', 'unknown');
                }
            }
        }
        this.socket.on('close', this.callbacks.close);
        this.socket.on('message', this.callbacks.message);
    }

    public cleanup(newId: string) {
        this.log(SOCKET_LOG_EVENT.CLEANUP, newId);
        this.socket.removeListener('close', this.callbacks.close);
        this.socket.removeListener('message', this.callbacks.message);
    }

    protected log(event: SOCKET_LOG_EVENT, data?: string, subevent?: string) {
        this.logger.debug({
            event,
            subevent,
            data,
            id: this.id,
            type: this.type as unknown as LOG_TYPE, //LOG_TYPE is a superset of SOCKET_TYPE. This is fine. It's okay.
            room: this.room?.id
        });
    }

}
