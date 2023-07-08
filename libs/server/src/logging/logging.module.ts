import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './entities/room.entity';
import { RoomLogger } from './logger/room.logger';
import { SocketLogger } from './logger/socket.logger';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'lipwig.db',
            entities: [RoomEntity],
            synchronize: true
        })
    ],
    providers: [RoomLogger, SocketLogger],
    exports: [TypeOrmModule, RoomLogger, SocketLogger]
})
export class LoggingModule { }
