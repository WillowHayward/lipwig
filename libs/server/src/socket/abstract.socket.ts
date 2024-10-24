import { BaseMessageData, CLOSE_CODE, ERROR_EVENT, ErrorMessageData, LogType, MESSAGE_EVENT, SocketLogEvent, } from '@lipwig/model';
import { SOCKET_TYPE } from './socket.model';
import { LipwigSocket } from './lipwig.socket';
import { LipwigLogger } from '../logging/logger/lipwig.logger';
import { Room } from '../room/room.instance';

type Callback = (...args: any[]) => void;

interface BaseEventData<T extends object> {
    [MESSAGE_EVENT]: BaseMessageData;
    [ERROR_EVENT]: ErrorMessageData<T>;
}

export abstract class AbstractSocket<Events extends BaseEventData<Errors>, Errors extends object> {
    private events: Record<string, Callback[]> = {};

    public connected = false;

    private callbacks: {
        close: (code: CLOSE_CODE) => void;
        message: (data: Buffer) => void;
    };

    constructor(public socket: LipwigSocket, public id: string, public type: SOCKET_TYPE, protected logger: LipwigLogger, public room?: Room) {
        this.connected = true;
        //socket?.socket?.cleanup(id); // TODO: Figure out what's up here, maybe rework anonymous socket
        /*if (socket.socket) {
            socket.socket.cleanup(id);
        }*/
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

        this.log(SocketLogEvent.INITIALIZED, message);
    }

    protected abstract setListeners(): void;

    // TODO: This has to clone the send method. Ideally this should be phased out entirely and errors should be logged at a higher level and then sent using .send
    error<E extends keyof Errors & string>(error: E, message?: string) {
        this.log(SocketLogEvent.ERROR, message, error);
        this.log(SocketLogEvent.SENDING, ERROR_EVENT, error);
        this.socket.send(JSON.stringify({
            event,
            data: {
                error,
                message
            }
        }));
    }

    send<K extends keyof Events>(
        event: K,
        ...dataArg: Events[K] extends never ? [] : [data: Events[K]]
    ): void {
        const [data] = dataArg;
        const messageEvent = event === MESSAGE_EVENT ? (data as BaseMessageData).event : event;

        this.log(SocketLogEvent.SENDING, messageEvent as string, event as string);
        this.socket.send(JSON.stringify({
            event,
            data
        }));
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
                this.log(SocketLogEvent.DISCONNECTED, message);
            },
            message: (data: Buffer) => {
                try {
                    const parsed = JSON.parse(data.toString('utf8'));
                    if (parsed.event) {
                        this.log(SocketLogEvent.RECEIVED, undefined, parsed.event);
                    } else {
                        throw new Error(); // Catch
                    }
                } catch {
                    this.log(SocketLogEvent.RECEIVED, 'Could not parse message', 'unknown');
                }
            }
        }
        this.socket.on('close', this.callbacks.close);
        this.socket.on('message', this.callbacks.message);
    }

    public cleanup(newId: string) {
        this.log(SocketLogEvent.CLEANUP, newId);
        this.socket.removeListener('close', this.callbacks.close);
        this.socket.removeListener('message', this.callbacks.message);
    }

    protected log(event: SocketLogEvent, data?: string, subevent?: string) {
        this.logger.debug({
            event,
            subevent,
            data,
            id: this.id,
            type: this.type as unknown as LogType, //LOG_TYPE is a superset of SOCKET_TYPE. This is fine. It's okay.
            room: this.room?.id
        });
    }

}
