import { SERVER_ADMIN_EVENT } from '@lipwig/model';
import { RoomService } from '../../lipwig/room/room.service';
import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { UninitializedSocket } from '../../common/classes/UninitializedSocket';
import { Admin } from '../classes/Admin';

// TODO: Guards - AdminGuard to check they're admin sending the commands
@Injectable()
export class AdminService {
    private admin: Admin[] = [];
    constructor(private rooms: RoomService) { }

    getAdmin(): Admin[] {
        return this.admin;
    }

    administrate(user: UninitializedSocket) {
        const id = v4();
        const socket = user.socket;
        const admin = new Admin(socket, id);

        this.admin.push(admin);
        admin.send({
            event: SERVER_ADMIN_EVENT.ADMINISTRATING,
        });
    }

    summary(admin: Admin, subscribe: boolean) {
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
