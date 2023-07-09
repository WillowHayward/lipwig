import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import {
    HOST_EVENT,
    HostEvents
} from '@lipwig/model';
import { RoomService } from '../service/room.service';
import { LipwigSocket, AnonymousSocket, HostSocket } from '../../socket';

@WebSocketGateway()
export class HostGateway {
    constructor(private rooms: RoomService) {}

    @SubscribeMessage(HOST_EVENT.CREATE)
    create(socket: LipwigSocket, payload: HostEvents.CreateData) {
        const config = payload.config;
        this.rooms.create(socket.socket as AnonymousSocket, config);
    }

    @SubscribeMessage(HOST_EVENT.JOIN_RESPONSE)
    joinResponse(socket: LipwigSocket, payload: HostEvents.JoinResponseData) {
        const id = payload.id;
        const response = payload.response;
        const reason = payload.reason;
        this.rooms.joinResponse(socket.socket as HostSocket, id, response, reason);
    }

    @SubscribeMessage(HOST_EVENT.LOCK)
    lock(socket: LipwigSocket, payload: HostEvents.LockData) {
        const reason = payload.reason;
        this.rooms.lock(socket.socket as HostSocket, reason);
    }

    @SubscribeMessage(HOST_EVENT.UNLOCK)
    unlock(socket: LipwigSocket) {
        this.rooms.unlock(socket.socket as HostSocket);
    }

    @SubscribeMessage(HOST_EVENT.POLL)
    poll(socket: LipwigSocket, payload: HostEvents.PollData) {
        const id = payload.id;
        const query = payload.query;
        const recipients = payload.recipients;
        this.rooms.poll(socket.socket as HostSocket, id, query, recipients);
    }

    @SubscribeMessage(HOST_EVENT.PONG_HOST)
    pongHost(socket: LipwigSocket, payload: HostEvents.PongHostData) {
        const time = payload.time;
        const id = payload.id;
        this.rooms.pongHost(socket.socket as HostSocket, time, id);
    }

    @SubscribeMessage(HOST_EVENT.PING_CLIENT)
    pingClient(socket: LipwigSocket, payload: HostEvents.PingClientData) {
        const time = payload.time;
        const id = payload.id;
        this.rooms.pingClient(socket.socket as HostSocket, time, id);
    }

    @SubscribeMessage(HOST_EVENT.KICK)
    kick(socket: LipwigSocket, payload: HostEvents.KickData) {
        const id = payload.id;
        const reason = payload.reason;
        this.rooms.kick(socket.socket as HostSocket, id, reason);
    }

    @SubscribeMessage(HOST_EVENT.LOCAL_JOIN)
    localJoin(socket: LipwigSocket, payload: HostEvents.LocalJoinData) {
        const id = payload.id;
        this.rooms.localJoin(socket.socket as HostSocket, id);
    }

    @SubscribeMessage(HOST_EVENT.LOCAL_LEAVE)
    localLeave(socket: LipwigSocket, payload: HostEvents.LocalLeaveData) {
        const id = payload.id;
        this.rooms.localLeave(socket.socket as HostSocket, id);
    }
}
