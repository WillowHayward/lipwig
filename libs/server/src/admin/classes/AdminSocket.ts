import { SOCKET_TYPE, WebSocket } from "../../common/lipwig.model";
import { AbstractSocket } from "../../common/classes/AbstractSocket";
import { CLOSE_CODE } from "@lipwig/model";

export class AdminSocket extends AbstractSocket {
    constructor(socket: WebSocket, id: string) {
        super(socket, id, SOCKET_TYPE.ADMIN);
    }

    protected setListeners(): void {
        // pass
    }
}
