import { Injectable } from "@nestjs/common";
import { Logger, createLogger, transports } from "winston";
import { RoomLog } from "../logging.model";
import { DataTransport } from "./data.transport";
import { Loggers } from "./loggers.singleton";

@Injectable()
export class RoomLogger {
    private logger: Logger;
    constructor() {
        Loggers.setRoomLogger(this);
        this.logger = createLogger({
            level: 'debug',
            transports: [
                new transports.Console(),
                //new DataTransport(),
            ]
        });
    }

    debug(log: RoomLog) {
        this.logger.log({
            level: 'debug',
            ...log
        });
    }

    log(log: RoomLog) {
        this.logger.log({
            level: 'info',
            ...log
        });
    }
}
