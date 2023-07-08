import { CLOSE_CODE } from "@lipwig/model";
import { Room } from "../room/instance/room.instance"
import { AbstractSocket } from "./abstract.socket";
import { LipwigSocket } from "./lipwig.socket";
import { SOCKET_TYPE } from "./socket.model";

export class ClientSocket extends AbstractSocket {
    constructor(socket: LipwigSocket, id: string, public room: Room) {
        super(socket, id, SOCKET_TYPE.CLIENT, room.id);
    }

    protected setListeners(): void {
        this.socket.on('close', (code: CLOSE_CODE, reasonBuffer: Buffer) => {
            let emit: string | undefined;
            let reason: string | undefined;
            switch (code) {
                case CLOSE_CODE.LEFT:
                    emit = 'leave';
                    if (reasonBuffer.length) {
                        reason = reasonBuffer.toString('utf8');
                    }
                    break;
                case CLOSE_CODE.CLOSED:
                case CLOSE_CODE.KICKED:
                    break;
                default:
                    emit = 'disconnect';
                    break;
            }

            if (emit) {
                this.emit(emit, reason);
            }
        });
    }

    override on(event: 'leave', callback: (reason?: string) => void): void;
    override on(event: 'close', callback: (reason?: string) => void): void;
    override on(event: 'disconnect', callback: (reason?: string) => void): void;
    override on(event: string, callback: (...args: any[]) => void): void {
        super.on(event, callback);
    }
}
