import { SERVER_ADMIN_EVENT } from '@lipwig/model';
import { RoomService } from '../../lipwig/room/room.service';
import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { UninitializedSocket } from '../../common/classes/UninitializedSocket';
import { AdminSocket } from '../classes/AdminSocket';

// TODO: Guards - AdminGuard to check they're admin sending the commands
@Injectable()
export class AdminService {
    private admin: AdminSocket[] = [];
    constructor(private rooms: RoomService) { }

    getAdmin(): AdminSocket[] {
        return this.admin;
    }

    administrate(user: UninitializedSocket) {
        const id = v4();
        const socket = user.socket;
        const admin = new AdminSocket(socket, id);

        this.admin.push(admin);
        admin.send({
            event: SERVER_ADMIN_EVENT.ADMINISTRATING,
        });
    }

    subscribe(user: AdminSocket) {

    }

    unsubscribe(user: AdminSocket) {

    }

    subscribeRoom(user: AdminSocket, id: string) {

    }

    unsubscribeRoom(user: AdminSocket, id: string) {

    }
}
