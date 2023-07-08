import { ADMIN_EVENT, AdminEvents } from '@lipwig/model';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { AdminService } from '../service/admin.service';
import { AnonymousSocket, AdminSocket, LipwigSocket } from '../../socket';

@WebSocketGateway()
export class AdminGateway {
    constructor(private admin: AdminService) { }

    @SubscribeMessage(ADMIN_EVENT.ADMINISTRATE)
    administrate(socket: LipwigSocket) {
        this.admin.administrate(socket.socket as AnonymousSocket);
    }

    @SubscribeMessage(ADMIN_EVENT.SUMMARY_REQUEST)
    summaryRequest(socket: LipwigSocket, payload: AdminEvents.SummaryRequestData) {
        const subscribe = payload.subscribe || false;
        this.admin.summary(socket.socket as AdminSocket, subscribe);
    }
}
