import { Injectable } from "@nestjs/common";
import { Logger, createLogger, transports } from 'winston';
import { Log } from "../logging.model";

@Injectable()
export class LipwigLogger {
    private logger: Logger;
    constructor() {
        this.logger = createLogger({
            level: 'debug',
            transports: [
                new transports.Console()
            ]
        });
    }

    debug(log: Log) {
        this.logger.log({
            level: 'debug',
            ...log
        });
    }

    log(log: Log) {
        this.logger.log({
            level: 'info',
            ...log
        });
    }
}
