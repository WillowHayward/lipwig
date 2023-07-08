import { SERVER_ADMIN_EVENT } from '@lipwig/model';
import { RoomService } from '../../room/service/room.service';
import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { AnonymousSocket, AdminSocket } from '../../socket';

// TODO: Guards - AdminGuard to check they're admin sending the commands
@Injectable()
export class AdminService {
    private admin: AdminSocket[] = [];
    constructor(private rooms: RoomService) { }

    getAdmin(): AdminSocket[] {
        return this.admin;
    }

    administrate(user: AnonymousSocket) {
        const id = v4();
        const socket = user.socket;
        const admin = new AdminSocket(socket, id);

        this.admin.push(admin);
        admin.send({
            event: SERVER_ADMIN_EVENT.ADMINISTRATING,
        });
    }

    summary(admin: AdminSocket, subscribe: boolean) {
        const rooms = this.rooms.getRooms();
        const count = Object.keys(rooms).length; //TODO: This does not account for recently closed
        admin.send({
            event: SERVER_ADMIN_EVENT.SUMMARY,
            data: {
                summary: {
                    total: count
                },
                subscribed: subscribe
            }
        });
    }

}
