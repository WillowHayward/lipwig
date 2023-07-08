import { Module } from '@nestjs/common';
import { AdminGateway } from './gateway/admin.gateway';
import { AdminService } from './service/admin.service';
import { LoggingModule } from '../logging/logging.module';
import { RoomModule } from '../room/room.module';
import { AdminController } from './controller/admin.controller';
import { DataModule } from '../data/data.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from '../data/entities/room.entity';
import { LogEntity } from '../data/entities/log.entity';

@Module({
    imports: [RoomModule, LoggingModule, DataModule, TypeOrmModule.forFeature([RoomEntity, LogEntity])],
    controllers: [AdminController],
    providers: [AdminGateway, AdminService],
    exports: [],
})
export class AdminModule {}
