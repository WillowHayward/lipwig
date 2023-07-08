import { CLOSE_CODE, ERROR_CODE, SERVER_GENERIC_EVENTS, ServerAdminEvents, ServerClientEvents, ServerGenericEvents, ServerHostEvents } from '@lipwig/model';
import { SOCKET_TYPE } from './socket.model';
import { LipwigSocket } from './lipwig.socket';
import { LipwigLogger } from '../logging/logger/lipwig.logger';
import { Log } from '../logging/logging.model';
import { Room } from '../room/instance/room.instance';

type Callback = (...args: any[]) => void;

export abstract class AbstractSocket {
    private events: {
        [event: string]: Callback[];
    } = {};

    public connected = false;

    protected logTemplate: Partial<Log>;

    constructor(public socket: LipwigSocket, public id: string, public type: SOCKET_TYPE, protected logger: LipwigLogger, public room?: Room) {
        this.connected = true;
        this.setListeners();

        this.logTemplate = {
            socket: id,
            room: room?.id
        }
        this.logger.debug({
            ...this.logTemplate,
            message: type,
            event: 'Initialized',
        });
    }

    protected abstract setListeners(): void;

    error(error: ERROR_CODE, message = '') {
        this.logger.debug({
            ...this.logTemplate,
            message,
            event: 'Sending error',
            subevent: error
        });

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
        let subevent: string | undefined;
        if (message.event === 'lw-message') { // TODO: Move to enum
            subevent = message.data.event;
        }
        this.logger.debug({
            ...this.logTemplate,
            message: message.event,
            event: 'Sending event',
            subevent,
        });
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
