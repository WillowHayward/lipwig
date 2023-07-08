import { Injectable } from "@nestjs/common";
import { Logger, createLogger, transports } from "winston";
import 'winston-daily-rotate-file';

import { RoomLog } from "../logging.model";
import { DataTransport } from "./data.transport";
import { Loggers } from "./loggers.singleton";
import { formatConsole, formatFile } from "./formatting";

@Injectable()
export class RoomLogger {
    private logger: Logger;
    constructor() {
        Loggers.setRoomLogger(this);
        this.logger = createLogger({
            level: 'debug',
            transports: [
                new transports.Console({
                    format: formatConsole
                }),
                new transports.DailyRotateFile({
                    format: formatFile,
                    filename: 'logs/lipwig.rooms.log.%DATE%'
                })
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
