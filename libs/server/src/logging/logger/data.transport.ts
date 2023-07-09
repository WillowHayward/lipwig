import * as Transport from 'winston-transport';
import { ApiLog, RoomLog, SocketLog } from '../logging.model';
import { Repository } from 'typeorm';
import { LogEntity } from '../../data/entities/log.entity';

type LogLevel = 'info' | 'debug';
interface RoomLogInfo extends RoomLog {
    level: LogLevel;
}

interface SocketLogInfo extends SocketLog {
    level: LogLevel;
}

interface ApiLogInfo extends ApiLog {
    level: LogLevel;
}

export class DataTransport extends Transport {
    constructor(private logs: Repository<LogEntity>) {
        super();
    }

    public override log(info: RoomLogInfo | SocketLogInfo | ApiLogInfo, next: () => void) {
        setImmediate(() => {
            const now = (new Date()).getTime();

            let uid: string | undefined;
            if ('id' in info) {
                uid = info.id;
            }

            let room: string | undefined;
            if ('room' in info) {
                room = info.room;
            }

            const entity = this.logs.create({
                timestamp: now,
                level: info.level,
                type: info.type,
                event: info.event,
                data: info.data,
                subevent: info.subevent,
                uid,
                room,
            });
            this.logs.save(entity);
        });

        next();
    }
}
