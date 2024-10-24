import {
    SERVER_GENERIC_EVENTS,
    GENERIC_EVENT,
    CLOSE_CODE,
    ClientEvents,
    HostEvents,
    GenericEvents,
    AdminEvents,
} from '@lipwig/model';
import { EventManager } from './EventManager';
import * as Logger from 'loglevel';
// TODO: "this.name" is never Local*

export class Socket extends EventManager {
    private socket?: WebSocket;
    private retry = true;
    private id?: string;
    private room?: string;
    private local: boolean;
    constructor(private url: string, private name: string) {
        super();

        this.local = this.name.startsWith('Local') || this.url.length === 0;
        if (this.local) {
            return;
        }
        Logger.debug(this.url, this.name);

        // This is a tiny bit hacky, but for the LocalClient functionality this had to be option here or in Client, and this has less potential impact
        this.socket = new WebSocket(url);
        this.addListeners();
        Logger.log('New WebSocket', this.socket);
    }

    private addListeners(): void {
        if (this.local || !this.socket) {
            return;
        }

        this.socket.addEventListener('open', () => {
            this.emit('connected');
        });
        this.socket.addEventListener('error', () => {
            this.emit('error');
            // TODO: error handling
        });

        this.socket.addEventListener('message', (event: MessageEvent) => {
            const message = JSON.parse(event.data);
            if (message.event === SERVER_GENERIC_EVENTS.ERROR) {
                Logger.info(message);
                this.emit('lw-error', message.data.error, message.data.message);
            } else if (message.event === SERVER_GENERIC_EVENTS.QUERY_RESPONSE) {
                this.emit('query-response', message.data);
                this.close(CLOSE_CODE.QUERY_COMPLETE); // TODO: Close as server w/ response as reason?
            } else {
                this.emit('message', message);
            }
        });

        this.socket.addEventListener('close', (event: CloseEvent) => {
            switch (event.code) {
                case CLOSE_CODE.KICKED:
                    this.emit('kicked', event.reason);
                    break;
                case CLOSE_CODE.LEFT:
                    // TODO
                    break;
                case CLOSE_CODE.CLOSED:
                    this.emit('closed', event.reason);
                    break;
                default:
                    this.emit('disconnected');

                    if (!this.room || !this.id) {
                        // Nothing to reconnect to
                        return;
                    }

                    if (this.retry) {
                        this.autoReconnect();
                    }
                    break;
            }
        });
    }

    public close(code: CLOSE_CODE, data?: any) {
        this.socket?.close(code, data);
    }

    public send(
        message: GenericEvents.Event | ClientEvents.Event | HostEvents.Event | AdminEvents.Event
    ): void {
        //TODO: Add in contingency system for messages sent during a disconnection
        //CONT: A queue of messages to be sent in bulk on resumption of connection
        //CONT: Possible return unsent messages from this method
        this.socket?.send(JSON.stringify(message));
    }

    private autoReconnect(): void {
        if (!this.url.length) {
            return;
        }

        Logger.info(`[${this.name}] Attempting to reconnect`);
        const socket: WebSocket = new WebSocket(this.url);

        socket.addEventListener('error', (): void => {
            Logger.info(`[${this.name}] Reconnect failed, retrying in 1000ms`);
            setTimeout(this.autoReconnect, 1000);
        });

        socket.addEventListener('open', (): void => {
            this.reconnect(socket);
        });
    }

    public setData(room: string, id: string) {
        this.room = room;
        this.id = id;
    }

    private reconnect(socket: WebSocket): void {
        if (!this.room || !this.id) {
            // Nothing to reconnect to
            return;
        }

        Logger.log(`[${this.name}] Reconnected`);
        this.socket = socket;
        this.addListeners();
        //TODO: Try and make this account for ServerClient and ServerHost split
        const message: GenericEvents.Reconnect = {
            event: GENERIC_EVENT.RECONNECT,
            data: {
                code: this.room,
                id: this.id,
            },
        };

        this.send(message);
    }
}
