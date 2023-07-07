import { CLOSE_CODE } from "@lipwig/model";
import { SOCKET_TYPE, WebSocket } from "../lipwig.model";
import { AbstractSocket } from "./AbstractSocket";
import { Logger } from "@nestjs/common";

export class UninitializedSocket extends AbstractSocket {
    constructor(socket: WebSocket) {
        super(socket, 'Uninitialized Socket', SOCKET_TYPE.UNINITIALIZED);
        Logger.debug('New Websocket Connection', 'Uninitialized Socket');
    }

    protected override setListeners(): void {
        // BUG: Between here and the next socket initialization, like 10 more 'close' emitters get added.
        // Unsure if this is a nest thing or a leak, but this is a hotfix
        this.socket.setMaxListeners(15);

        // This should persist past initialization, hopefully
        this.socket.on('close', (code: CLOSE_CODE) => {
            const context = this.socket.socket?.id || 'Uninitialized Socket';
            Logger.debug(`Disconnected with code ${code}`, context);
        });
    }
}
