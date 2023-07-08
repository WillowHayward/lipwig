import { Injectable } from "@nestjs/common";
import { Logger, createLogger, transports } from 'winston';
import 'winston-daily-rotate-file';

import { DataTransport } from "./data.transport";
import { Loggers } from "./loggers.singleton";
import { SocketLog } from "../logging.model";
import { formatConsole, formatFile } from "./formatting";

@Injectable()
export class SocketLogger {
    private logger: Logger;
    constructor() {
        Loggers.setSocketLogger(this);
        this.logger = createLogger({
            level: 'debug',
            transports: [
                new transports.Console({
                    format: formatConsole,
                }),
                new transports.DailyRotateFile({
                    format: formatFile,
                    filename: 'logs/lipwig.sockets.log.%DATE%'
                })
                //new DataTransport(),
            ]
        });
    }

    debug(log: SocketLog) {
        this.logger.log({
            level: 'debug',
            ...log
        });
    }

    log(log: SocketLog) {
        this.logger.log({
            level: 'info',
            ...log
        });
    }
}
