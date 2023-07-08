import { CLOSE_CODE } from "@lipwig/model";
import { SOCKET_TYPE, WebSocket } from "../lipwig.model";
import { AbstractSocket } from "./AbstractSocket";

export class AnonymousSocket extends AbstractSocket {
    constructor(socket: WebSocket) {
        super(socket, 'Anonymous', SOCKET_TYPE.UNINITIALIZED);
    }

    protected override setListeners(): void {
        // BUG: Between here and the next socket initialization, like 10 more 'close' emitters get added.
        // Unsure if this is a nest thing or a leak, but this is a potential bandaid solution
        this.socket.setMaxListeners(15);

        // This should persist past initialization, hopefully
        this.socket.on('close', (code: CLOSE_CODE) => {
            // Update logger for close after initialization
            const socket = this.socket.socket;
            this.logger.setGroup(socket.type);
            this.logger.setId(socket.id);

            const reason = CLOSE_CODE[code]; // BUG: This list is non-comprehensive
            this.logger.debug(`Disconnected with code ${code} (${reason})`);
        });
    }
}
