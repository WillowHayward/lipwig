import { CLOSE_CODE } from "@lipwig/model";
import { SOCKET_TYPE } from "./socket.model";
import { LipwigSocket } from "./lipwig.socket";
import { AbstractSocket } from "./abstract.socket";
import { SocketLogger } from "../logging/logger/socket.logger";
import { Room } from "../room/instance/room.instance";

export class HostSocket extends AbstractSocket {
    constructor(socket: LipwigSocket, id: string, logger: SocketLogger, public override room: Room) {
        super(socket, id, SOCKET_TYPE.HOST, logger, room);
    }

    protected setListeners(): void {
        this.socket.on('close', (code: CLOSE_CODE, reasonBuffer: Buffer) => {
            let emit: string | undefined;
            let reason: string | undefined;
            switch (code) {
                case CLOSE_CODE.CLOSED:
                    emit = 'close';
                    if (reasonBuffer.length) {
                        reason = reasonBuffer.toString('utf8');
                    }
                    break;
                case CLOSE_CODE.LEFT:
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

    override on(event: 'close', callback: (reason?: string) => void): void;
    override on(event: 'disconnect', callback: (reason?: string) => void): void;
    override on(event: string, callback: (...args: any[]) => void): void {
        super.on(event, callback);
    }
}
