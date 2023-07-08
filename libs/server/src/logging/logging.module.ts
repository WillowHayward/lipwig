import { Module } from '@nestjs/common';
import { DataModule } from '../data/data.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from '../data/entities/room.entity';
import { SocketLogger } from './logger/socket.logger';
import { RoomLogger } from './logger/room.logger';

@Module({
    imports: [DataModule, TypeOrmModule.forFeature([RoomEntity])],
    providers: [SocketLogger, RoomLogger],
    exports: [SocketLogger, RoomLogger]
})
export class LoggingModule { }
