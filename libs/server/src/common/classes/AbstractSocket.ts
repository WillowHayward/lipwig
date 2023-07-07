import { SOCKET_TYPE, WebSocket } from '../lipwig.model';
import { CLOSE_CODE, ERROR_CODE, SERVER_GENERIC_EVENTS, ServerAdminEvents, ServerClientEvents, ServerGenericEvents, ServerHostEvents } from '@lipwig/model';
import { LipwigLogger } from '../../logging/logger/logger.service';

type Callback = (...args: any[]) => void;

export abstract class AbstractSocket {
    private events: {
        [event: string]: Callback[];
    } = {};
    protected logger: LipwigLogger;

    public connected = false;

    constructor(public socket: WebSocket, public id: string, public type: SOCKET_TYPE, room?: string) {
        this.connected = true;
        this.logger = new LipwigLogger(type, id);
        if (room) {
            this.logger.setRoom(room);
        }
        this.setListeners();
        this.logger.debug('Initialised');
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
