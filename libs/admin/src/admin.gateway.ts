import { ADMIN_EVENT } from '@lipwig/model';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { AdminService } from './admin/admin.service';
import { WebSocket } from '@lipwig/server'

@WebSocketGateway()
export class AdminGateway {
    constructor(private admin: AdminService) { }

    @SubscribeMessage(ADMIN_EVENT.ADMINISTRATE)
    administrate(socket: WebSocket) {
        this.admin.administrate(socket.socket);
    }
}
