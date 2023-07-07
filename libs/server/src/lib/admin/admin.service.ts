import { SERVER_ADMIN_EVENT } from '@lipwig/model';
import { LipwigSocket } from '../classes/LipwigSocket';
import { RoomService } from '../room/room.service';
import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

// TODO: Guards - AdminGuard to check they're admin sending the commands
@Injectable()
export class AdminService {
    private admin: LipwigSocket[] = [];
    constructor(private rooms: RoomService) { }

    getAdmin(): LipwigSocket[] {
        return this.admin;
    }

    administrate(user: LipwigSocket) {
        const id = v4();
        user.setId(id);
        this.admin.push(user);
        user.send({
            event: SERVER_ADMIN_EVENT.ADMINISTRATING,
        });
    }

    subscribe(user: LipwigSocket) {

    }

    unsubscribe(user: LipwigSocket) {

    }

    subscribeRoom(user: LipwigSocket, id: string) {

    }

    unsubscribeRoom(user: LipwigSocket, id: string) {

    }
}
