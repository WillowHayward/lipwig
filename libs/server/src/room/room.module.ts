import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { HostGateway } from './gateway/host.gateway';
import { ClientGateway } from './gateway/client.gateway';
import { GenericGateway } from './gateway/generic.gateway';
import { RoomService } from './service/room.service';

import { LoggingModule } from '../logging/logging.module';

import { RoomEntity } from '../data/entities/room.entity';
import { DataModule } from '../data/data.module';
@Module({
    imports: [LoggingModule, DataModule, TypeOrmModule.forFeature([RoomEntity])],
    controllers: [],
    providers: [HostGateway, ClientGateway, GenericGateway, RoomService],
    exports: [RoomService],
})
export class RoomModule { }
