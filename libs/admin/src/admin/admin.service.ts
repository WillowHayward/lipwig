import { LipwigSocket, RoomService } from '@lipwig/server';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
    constructor(private rooms: RoomService) {}

    administrate(user: LipwigSocket) {
    }
}
