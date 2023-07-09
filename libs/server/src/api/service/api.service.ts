import { Injectable } from "@nestjs/common";
import { RoomService } from "../../room/service/room.service";
import { API_LOG_EVENT, LOG_TYPE, RoomQuery } from "@lipwig/model";
import { LipwigLogger } from "../../logging/logger/lipwig.logger";

@Injectable()
export class ApiService {
    constructor(private rooms: RoomService, private logger: LipwigLogger) { }

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

        this.logger.log({
            type: LOG_TYPE.API,
            event: API_LOG_EVENT.GET,
            subevent: 'query',
            data: '200'
        });

        return response;
    }
}
