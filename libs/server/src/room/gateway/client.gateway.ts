import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import {
    CLIENT_EVENT,
    ClientEvents
} from '@lipwig/model';
import { RoomService } from '../service/room.service';
import { LipwigSocket, AnonymousSocket, ClientSocket } from '../../socket';

@WebSocketGateway()
export class ClientGateway {
    constructor(private rooms: RoomService) {}

    @SubscribeMessage(CLIENT_EVENT.JOIN)
    join(socket: LipwigSocket, payload: ClientEvents.JoinData) {
        const code = payload.code;
        const options = payload.options;
        this.rooms.join(socket.socket as AnonymousSocket, code, options);
    }

    @SubscribeMessage(CLIENT_EVENT.REJOIN)
    rejoin(socket: LipwigSocket, payload: ClientEvents.RejoinData) {
        const code = payload.code;
        const id = payload.id;
        this.rooms.rejoin(socket.socket as AnonymousSocket, code, id);
    }

    @SubscribeMessage(CLIENT_EVENT.POLL_RESPONSE)
    pollResponse(socket: LipwigSocket, payload: ClientEvents.PollResponseData) {
        const id = payload.id;
        const response = payload.response;
        this.rooms.pollResponse(socket.socket as ClientSocket, id, response);
    }

    @SubscribeMessage(CLIENT_EVENT.PING_HOST)
    pingHost(socket: LipwigSocket, payload: ClientEvents.PingHostData) {
        const time = payload.time;
        this.rooms.pingHost(socket.socket as ClientSocket, time);
    }

    @SubscribeMessage(CLIENT_EVENT.PONG_CLIENT)
    pongClient(socket: LipwigSocket, payload: ClientEvents.PongClientData) {
        const time = payload.time;
        this.rooms.pongClient(socket.socket as ClientSocket, time);
    }

}
