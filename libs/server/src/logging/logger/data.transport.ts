import * as Transport from 'winston-transport';
import { RoomLog, SocketLog } from '../logging.model';
import { Repository } from 'typeorm';
import { LogEntity } from '../../data/entities/log.entity';

type LogLevel = 'info' | 'debug';
interface RoomLogInfo extends RoomLog {
    level: LogLevel;
}

interface SocketLogInfo extends SocketLog {
    level: LogLevel;
}

export class DataTransport extends Transport {
    constructor(private logs: Repository<LogEntity>) {
        super();
    }

    public override log(info: RoomLogInfo | SocketLogInfo, next: () => void) {
        setImmediate(() => {
            const now = (new Date()).getTime();
            let type: string;
            if ('type' in info) {
                type = info.type;
            } else {
                type = 'ROOM';
            }

            let room: string | undefined;
            if ('room' in info) {
                room = info.room;
            }

            const entity = this.logs.create({
                timestamp: now,
                level: info.level,
                type,
                uid: info.id,
                event: info.event,
                message: info.message,
                subevent: info.subevent,
                room
            });
            this.logs.save(entity);
        });

        next();
    }
}
