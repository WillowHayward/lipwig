import { OnGatewayConnection, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import {
    GENERIC_EVENT,
    PING_EVENT,
    GenericEvents,
    ClientEvents,
    HostEvents,
} from '@lipwig/model';
import { WebSocket } from '../lipwig.model';
import { LipwigSocket } from '../classes/LipwigSocket';
import { Logger } from '@nestjs/common';
import { RoomService } from '../room/room.service';

@WebSocketGateway()
export class GenericGateway implements OnGatewayConnection {
    constructor(private rooms: RoomService) {}

    handleConnection(socket: WebSocket) {
        // TODO: This is firing twice on reconnection, for some reason
        Logger.debug('New Websocket Connection', 'Uninitialized Socket');
        const lipwigSocket = new LipwigSocket(socket);
        socket.socket = lipwigSocket;
    }


    // TODO: Should this be a HTTP request?
    @SubscribeMessage(GENERIC_EVENT.QUERY)
    query(socket: WebSocket, payload: GenericEvents.QueryData) {
        const code = payload.room;
        const id = payload.id;
        this.rooms.query(socket.socket, code, id);
    }

    @SubscribeMessage(GENERIC_EVENT.RECONNECT)
    reconnect(
        socket: WebSocket,
        payload: GenericEvents.ReconnectData
    ) {
        const code = payload.code;
        const id = payload.id;
        this.rooms.reconnect(socket.socket, code, id);
    }

    // TODO: Can these be merged into a generic event? They have different args
    @SubscribeMessage(GENERIC_EVENT.MESSAGE)
    message(
        socket: WebSocket,
        payload: HostEvents.MessageData | ClientEvents.MessageData
    ) {
        this.rooms.message(socket.socket, payload);
    }

    @SubscribeMessage(PING_EVENT.PING_SERVER)
    pingServer(
        socket: WebSocket,
        payload: HostEvents.PingServerData | ClientEvents.PingServerData
    ) {
        const time = payload.time;
        socket.send(
            JSON.stringify({
                event: PING_EVENT.PONG_SERVER,
                data: { time },
            })
        );
    }

}
