import { ADMIN_EVENT } from '@lipwig/model';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { AdminService } from '../admin/admin.service';
import { WebSocket } from '../../common/lipwig.model'
import { UninitializedSocket } from '../../common/classes/UninitializedSocket';

@WebSocketGateway()
export class AdminGateway {
    constructor(private admin: AdminService) { }

    @SubscribeMessage(ADMIN_EVENT.ADMINISTRATE)
    administrate(socket: WebSocket) {

        this.admin.administrate(socket.socket as UninitializedSocket);
    }
}
