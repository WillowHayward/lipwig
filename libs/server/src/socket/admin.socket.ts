import { ServerAdminEvents, ServerGenericEvents } from "@lipwig/model";
import { AbstractSocket } from './abstract.socket';
import { LipwigSocket } from './lipwig.socket';
import { SOCKET_TYPE } from './socket.model';
import { LipwigLogger } from "../logging/logger/lipwig.logger";

export class AdminSocket extends AbstractSocket {
    constructor(socket: LipwigSocket, id: string, logger: LipwigLogger) {
        super(socket, id, SOCKET_TYPE.ADMIN, logger);
    }

    protected setListeners(): void {
        // pass
    }

    public override send(message: ServerAdminEvents.Event | ServerGenericEvents.Event): void {
        super.send(message);
    }
}
