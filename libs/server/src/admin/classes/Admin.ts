import { SOCKET_TYPE, WebSocket } from "../../common/lipwig.model";
import { AbstractSocket } from "../../common/classes/AbstractSocket";
import { ServerAdminEvents, ServerGenericEvents } from "@lipwig/model";

export class Admin extends AbstractSocket {
    constructor(socket: WebSocket, id: string) {
        super(socket, id, SOCKET_TYPE.ADMIN);
    }

    protected setListeners(): void {
        // pass
    }

    public override send(message: ServerAdminEvents.Event | ServerGenericEvents.Event): void {
        super.send(message);
    }
}
