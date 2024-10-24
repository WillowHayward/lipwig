import { OnGatewayConnection, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import {
    GENERIC_EVENT,
    PING_EVENT,
    GenericEvents,
    ClientEvents,
    HostEvents,
} from '@lipwig/model';
import { RoomService } from '../service/room.service';
import { LipwigSocket, AnonymousSocket, HostSocket } from '../../socket';
import { LipwigLogger } from '../../logging/logger/lipwig.logger';

@WebSocketGateway()
export class GenericGateway implements OnGatewayConnection {
    constructor(private rooms: RoomService, private logger: LipwigLogger) { }

    handleConnection(socket: LipwigSocket) {
        // TODO: This is firing twice on reconnection, for some reason
        socket.setMaxListeners(12);
        socket.socket = new AnonymousSocket(socket, this.logger);
    }

    @SubscribeMessage(GENERIC_EVENT.RECONNECT)
    reconnect(
        socket: LipwigSocket,
        payload: GenericEvents.ReconnectData
    ) {
        const code = payload.code;
        const id = payload.id;
        this.rooms.reconnect(socket.socket as AnonymousSocket, code, id);
    }

    // TODO: Can these be merged into a generic event? They have different args
    @SubscribeMessage(GENERIC_EVENT.MESSAGE)
    message(
        socket: LipwigSocket,
        payload: HostEvents.MessageData | ClientEvents.MessageData
    ) {
        this.rooms.message(socket.socket as HostSocket, payload); // TODO: Make this more generic
    }

    @SubscribeMessage(PING_EVENT.PING_SERVER)
    pingServer(
        socket: LipwigSocket,
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
