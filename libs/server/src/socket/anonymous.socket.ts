import { AbstractSocket } from "./abstract.socket";
import { LipwigSocket } from "./lipwig.socket";
import { SOCKET_TYPE } from "./socket.model";
import { LipwigLogger } from "../logging/logger/lipwig.logger";
import { v4 } from "uuid";

export class AnonymousSocket extends AbstractSocket {
    constructor(socket: LipwigSocket, logger: LipwigLogger) {
        const id = v4();
        super(socket, id, SOCKET_TYPE.ANONYMOUS, logger);
    }

    protected override setListeners(): void {
        // pass
    }
}
