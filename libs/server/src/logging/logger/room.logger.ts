import { Injectable } from "@nestjs/common";
import { AbstractLogger } from "./abstract.logger";

@Injectable()
export class RoomLogger extends AbstractLogger {
    constructor(protected override id: string) {
        super('Room', id);
        this.setRoom(id);
    }
}
