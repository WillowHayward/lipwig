import { Logger } from '@nestjs/common';
import { SOCKET_TYPE, WebSocket } from '../lipwig.model';
import { CLOSE_CODE, ERROR_CODE, SERVER_GENERIC_EVENTS, ServerAdminEvents, ServerClientEvents, ServerGenericEvents, ServerHostEvents } from '@lipwig/model';

type Callback = (...args: any[]) => void;

export abstract class AbstractSocket {
    private events: {
        [event: string]: Callback[];
    } = {};

    public connected = false;

    constructor(public socket: WebSocket, public id: string, public type: SOCKET_TYPE) {
        this.connected = true;
        this.setListeners();
        Logger.debug('Initialised', this.id);
    }

    protected abstract setListeners(): void;

    error(error: ERROR_CODE, message?: string) {
        const context = this.id || 'Uninitialized Socket';
        if (message) {
            Logger.debug(`Sending error ${error} - ${message}`, context);
        } else {
            Logger.debug(`Sending error ${error}`, context);
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
        message:
            | ServerHostEvents.Event
            | ServerClientEvents.Event
            | ServerGenericEvents.Event
            | ServerAdminEvents.Event
    ) {
        const context = this.id || 'Uninitialized Socket';
        Logger.debug(`Sending event '${message.event}'`, context);
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
