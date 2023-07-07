import { Module } from '@nestjs/common';

import { HostGateway } from './gateway/host.gateway';
import { ClientGateway } from './gateway/client.gateway';
import { GenericGateway } from './gateway/generic.gateway';
import { RoomService } from './room/room.service';
import { LoggingModule } from '../logging/logging.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from '../logging/entities/room.entity';
@Module({
    imports: [LoggingModule, TypeOrmModule.forFeature([RoomEntity])],
    controllers: [],
    providers: [HostGateway, ClientGateway, GenericGateway, RoomService],
    exports: [RoomService],
})
export class LipwigModule { }
