import { ADMIN_EVENT, AdminEvents } from '@lipwig/model';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { AdminService } from '../admin/admin.service';
import { WebSocket } from '../../common/lipwig.model'
import { UninitializedSocket } from '../../common/classes/UninitializedSocket';
import { Admin } from '../classes/Admin';

@WebSocketGateway()
export class AdminGateway {
    constructor(private admin: AdminService) { }

    @SubscribeMessage(ADMIN_EVENT.ADMINISTRATE)
    administrate(socket: WebSocket) {
        this.admin.administrate(socket.socket as UninitializedSocket);
    }

    @SubscribeMessage(ADMIN_EVENT.SUMMARY_REQUEST)
    summaryRequest(socket: WebSocket, payload: AdminEvents.SummaryRequestData) {
        const subscribe = payload.subscribe || false;
        this.admin.summary(socket.socket as Admin, subscribe);
    }
}
