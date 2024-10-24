import { ADMIN_EVENT } from '@lipwig/model';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { AdminService } from '../service/admin.service';
import { AnonymousSocket, LipwigSocket } from '../../../socket';

@WebSocketGateway()
export class AdminGateway {
    constructor(private admin: AdminService) { }

    @SubscribeMessage(ADMIN_EVENT.ADMINISTRATE)
    administrate(socket: LipwigSocket) {
        this.admin.administrate(socket.socket as AnonymousSocket);
    }
}
