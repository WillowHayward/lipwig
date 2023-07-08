import { CLOSE_CODE, ERROR_CODE, SERVER_GENERIC_EVENTS, ServerAdminEvents, ServerClientEvents, ServerGenericEvents, ServerHostEvents } from '@lipwig/model';
import { SOCKET_TYPE } from './socket.model';
import { LipwigSocket } from './lipwig.socket';
import { SocketLogger } from '../logging/logger/socket.logger';
import { Room } from '../room/instance/room.instance';

type Callback = (...args: any[]) => void;

export abstract class AbstractSocket {
    private events: {
        [event: string]: Callback[];
    } = {};

    public connected = false;

    private closeCallback: (code: CLOSE_CODE) => void;

    constructor(public socket: LipwigSocket, public id: string, public type: SOCKET_TYPE, protected logger: SocketLogger, public room?: Room) {
        this.connected = true;
        if (socket.socket) {
            socket.socket.cleanup(id);
        }
        //TODO: Set socket.socket here?
        this.setCloseListener();
        this.setListeners();

        let message: string;
        switch(type) {
            case SOCKET_TYPE.ANONYMOUS:
                message = 'Anonymous Socket';
                break;
            case SOCKET_TYPE.HOST:
                message = 'Host Socket';
                break;
            case SOCKET_TYPE.CLIENT:
                message = 'Client Socket';
                break;
            case SOCKET_TYPE.ADMIN:
                message = 'Admin Socket';
                break;
        }

        this.log('Initialized', message);
    }

    protected abstract setListeners(): void;

    error(error: ERROR_CODE, message = '') {
        this.log('Sending Error', message, error);

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
        this.log('Sending Event', message.event, subevent);
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

    protected log(event: string, message: string, subevent?: string) {
        this.logger.debug({
            event,
            subevent,
            message,
            id: this.id,
            type: this.type,
            room: this.room?.id
        });
    }

    private setCloseListener() {
        this.closeCallback = (code: CLOSE_CODE) => {
            let message = code.toString();
            if (code >= 3000) {
                const reason = CLOSE_CODE[code];
                message += ` (${reason})`;
            }
            this.log('Disconnected', message);
        }
        this.socket.on('close', this.closeCallback);
    }

    public cleanup(newId: string) {
        this.log('Cleaning Up', newId);
        this.socket.removeListener('close', this.closeCallback);
    }
}
