import { Injectable } from "@nestjs/common";
import { Logger, createLogger, transports } from "winston";
import 'winston-daily-rotate-file';

import { RoomLog, SocketLog } from "../logging.model";
import { DataTransport } from "./data.transport";
import { formatConsole, formatFile } from "./formatting";

import { InjectRepository } from "@nestjs/typeorm";
import { LogEntity } from "../../data/entities/log.entity";
import { Repository } from "typeorm";

@Injectable()
export class LipwigLogger {
    private logger: Logger;
    constructor(@InjectRepository(LogEntity) logRepo: Repository<LogEntity>) {
        this.logger = createLogger({
            level: 'debug',
            transports: [
                new transports.Console({
                    format: formatConsole
                }),
                new transports.DailyRotateFile({
                    format: formatFile,
                    filename: 'logs/lipwig.log.%DATE%'
                }),
                new DataTransport(logRepo),
            ]
        });
    }

    debug(log: RoomLog | SocketLog) {
        this.logger.log({
            level: 'debug',
            ...log
        });
    }

    log(log: RoomLog | SocketLog) {
        this.logger.log({
            level: 'info',
            ...log
        });
    }
}
