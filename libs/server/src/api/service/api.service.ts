import { Injectable } from "@nestjs/common";
import { RoomService } from "../../room/service/room.service";
import { RoomQuery } from "@lipwig/model";

@Injectable()
export class ApiService {
    constructor(private rooms: RoomService) {}

    async query(code: string, id?: string): Promise<RoomQuery> {
        let response: RoomQuery;
        if (!this.rooms.roomExists(code)) {
            response = {
                exists: false,
                room: code,
            };
        } else {
            const room = this.rooms.getRoom(code);
            response = room.query(id);
        }

        return response;
    }
}
