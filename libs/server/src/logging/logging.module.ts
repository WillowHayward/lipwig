import { Module } from '@nestjs/common';
import { DataModule } from '../data/data.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketLogger } from './logger/socket.logger';
import { RoomLogger } from './logger/room.logger';
import { LogEntity } from '../data/entities/log.entity';

@Module({
    imports: [DataModule, TypeOrmModule.forFeature([LogEntity])],
    providers: [SocketLogger, RoomLogger],
    exports: [SocketLogger, RoomLogger]
})
export class LoggingModule { }
