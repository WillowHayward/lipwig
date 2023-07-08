import { CLOSE_CODE, ERROR_CODE, SERVER_GENERIC_EVENTS, ServerAdminEvents, ServerClientEvents, ServerGenericEvents, ServerHostEvents } from '@lipwig/model';
import { SocketLogger } from '../logging/logger/socket.logger';
import { SOCKET_TYPE } from './socket.model';
import { LipwigSocket } from './lipwig.socket';

type Callback = (...args: any[]) => void;

export abstract class AbstractSocket {
    private events: {
        [event: string]: Callback[];
    } = {};
    protected logger: SocketLogger;

    public connected = false;

    constructor(public socket: LipwigSocket, public id: string, public type: SOCKET_TYPE, room?: string) {
        this.connected = true;
        this.logger = new SocketLogger(type, id);
        if (room) {
            this.logger.setRoom(room);
        }
        this.setListeners();
        this.logger.debug(`${type} Initialized`);
    }

    protected abstract setListeners(): void;

    error(error: ERROR_CODE, message?: string) {
        if (message) {
            this.logger.debug(`Sending error ${error} - ${message}`);
        } else {
            this.logger.debug(`Sending error ${error}`);
        }

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
        this.logger.debug(`Sending event '${message.event}'`);
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
}
