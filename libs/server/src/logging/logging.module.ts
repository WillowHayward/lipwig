import { Module } from '@nestjs/common';
import { RoomLogger } from './logger/room.logger';
import { SocketLogger } from './logger/socket.logger';

@Module({
    providers: [RoomLogger, SocketLogger],
    exports: [RoomLogger, SocketLogger]
})
export class LoggingModule { }
