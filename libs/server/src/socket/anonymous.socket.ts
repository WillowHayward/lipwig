import { CLOSE_CODE } from "@lipwig/model";
import { AbstractSocket } from "./abstract.socket";
import { LipwigSocket } from "./lipwig.socket";
import { SOCKET_TYPE } from "./socket.model";
import { SocketLogger } from "../logging/logger/socket.logger";

export class AnonymousSocket extends AbstractSocket {
    constructor(socket: LipwigSocket, logger: SocketLogger) {
        super(socket, 'Anonymous', SOCKET_TYPE.UNINITIALIZED, logger);
    }

    protected override setListeners(): void {
        // BUG: Between here and the next socket initialization, like 10 more 'close' emitters get added.
        // Unsure if this is a nest thing or a leak, but this is a potential bandaid solution
        this.socket.setMaxListeners(15);

        // This should persist past initialization, hopefully
        this.socket.on('close', (code: CLOSE_CODE) => {
            // Update logger for close after initialization
            const socket = this.socket.socket;
            this.logTemplate.socket = socket.id;
            this.logTemplate.room = socket.room?.id;

            const reason = CLOSE_CODE[code]; // BUG: This list is non-comprehensive
            this.logger.debug({
                ...this.logTemplate,
                message: `${code} (${reason})`,
                event: 'Disconnected',
            });
        });
    }
}
