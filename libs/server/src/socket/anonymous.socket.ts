import { AbstractSocket } from "./abstract.socket";
import { LipwigSocket } from "./lipwig.socket";
import { SOCKET_TYPE } from "./socket.model";
import { SocketLogger } from "../logging/logger/socket.logger";
import { v4 } from "uuid";

export class AnonymousSocket extends AbstractSocket {
    constructor(socket: LipwigSocket, logger: SocketLogger) {
        const id = v4();
        super(socket, id, SOCKET_TYPE.ANONYMOUS, logger);
    }

    protected override setListeners(): void {
        // pass
    }
}
