import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import {
    CLIENT_EVENT,
    ClientEvents
} from '@lipwig/model';
import { RoomService } from '../room/room.service';
import { WebSocket } from '../lipwig.model';

@WebSocketGateway()
export class ClientGateway {
    constructor(private rooms: RoomService) {}

    @SubscribeMessage(CLIENT_EVENT.JOIN)
    join(socket: WebSocket, payload: ClientEvents.JoinData) {
        const code = payload.code;
        const options = payload.options;
        this.rooms.join(socket.socket, code, options);
    }

    @SubscribeMessage(CLIENT_EVENT.REJOIN)
    rejoin(socket: WebSocket, payload: ClientEvents.RejoinData) {
        const code = payload.code;
        const id = payload.id;
        this.rooms.rejoin(socket.socket, code, id);
    }

    @SubscribeMessage(CLIENT_EVENT.POLL_RESPONSE)
    pollResponse(socket: WebSocket, payload: ClientEvents.PollResponseData) {
        const id = payload.id;
        const response = payload.response;
        this.rooms.pollResponse(socket.socket, id, response);
    }

    @SubscribeMessage(CLIENT_EVENT.PING_HOST)
    pingHost(socket: WebSocket, payload: ClientEvents.PingHostData) {
        const time = payload.time;
        this.rooms.pingHost(socket.socket, time);
    }

    @SubscribeMessage(CLIENT_EVENT.PONG_CLIENT)
    pongClient(socket: WebSocket, payload: ClientEvents.PongClientData) {
        const time = payload.time;
        this.rooms.pongClient(socket.socket, time);
    }

}
