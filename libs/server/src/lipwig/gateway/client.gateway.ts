import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import {
    CLIENT_EVENT,
    ClientEvents
} from '@lipwig/model';
import { RoomService } from '../room/room.service';
import { WebSocket } from '../../common/lipwig.model';
import { UninitializedSocket } from '../../common/classes/UninitializedSocket';
import { ClientSocket } from '../classes/ClientSocket';

@WebSocketGateway()
export class ClientGateway {
    constructor(private rooms: RoomService) {}

    @SubscribeMessage(CLIENT_EVENT.JOIN)
    join(socket: WebSocket, payload: ClientEvents.JoinData) {
        const code = payload.code;
        const options = payload.options;
        this.rooms.join(socket.socket as UninitializedSocket, code, options);
    }

    @SubscribeMessage(CLIENT_EVENT.REJOIN)
    rejoin(socket: WebSocket, payload: ClientEvents.RejoinData) {
        const code = payload.code;
        const id = payload.id;
        this.rooms.rejoin(socket.socket as UninitializedSocket, code, id);
    }

    @SubscribeMessage(CLIENT_EVENT.POLL_RESPONSE)
    pollResponse(socket: WebSocket, payload: ClientEvents.PollResponseData) {
        const id = payload.id;
        const response = payload.response;
        this.rooms.pollResponse(socket.socket as ClientSocket, id, response);
    }

    @SubscribeMessage(CLIENT_EVENT.PING_HOST)
    pingHost(socket: WebSocket, payload: ClientEvents.PingHostData) {
        const time = payload.time;
        this.rooms.pingHost(socket.socket as ClientSocket, time);
    }

    @SubscribeMessage(CLIENT_EVENT.PONG_CLIENT)
    pongClient(socket: WebSocket, payload: ClientEvents.PongClientData) {
        const time = payload.time;
        this.rooms.pongClient(socket.socket as ClientSocket, time);
    }

}
