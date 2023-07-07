/**
 * @author: WillHayCode
 */

import { Socket } from "../Socket";
import { EventManager } from "../EventManager";
import * as Logger from 'loglevel';
import { ADMIN_EVENT, AdminEvents, ERROR_CODE, SERVER_ADMIN_EVENT, ServerAdminEvents } from "@lipwig/model";


export class Admin extends EventManager {
    protected name = 'Admin';
    private socket: Socket;

    constructor(url: string) {
        super();

        this.socket = new Socket(url, this.name);

        this.socket.on('connected', () => {
            this.connected();
        });

        this.socket.on('error', () => {
            // TODO
        });

        this.socket.on('lw-error', (error: ERROR_CODE, message?: string) => {
            if (message) {
                Logger.warn(
                    `[${this.name}] Received error ${error} - ${message}`
                );
            } else {
                Logger.warn(`[${this.name}] Received error ${error}`);
            }

            this.emit('error', error, message);
        });

        this.socket.on('message', (message: ServerAdminEvents.Event) => {
            this.handle(message);
        });

        this.socket.on('disconnected', () => {
            Logger.debug(`[${this.name}] Disconnected`);
            this.emit('disconnected');
        });
    }

    private connected() {
        const message: AdminEvents.Administrate = {
            event: ADMIN_EVENT.ADMINISTRATE
        }
        this.socket.send(message);
    }

    private handle(message: ServerAdminEvents.Event) {
        switch (message.event) {
            case SERVER_ADMIN_EVENT.ADMINISTRATING:
                Logger.debug(`[${this.name}] Administrating`);
                break;
        }
    }

}
