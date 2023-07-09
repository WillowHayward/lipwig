import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { ApiController } from './controller/api.controller';
import { ApiService } from './service/api.service';
import { LoggingModule } from '../logging/logging.module';
import { DataModule } from '../data/data.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from '../data/entities/room.entity';
import { RoomModule } from '../room/room.module';

@Module({
    imports: [RoomModule, AdminModule, LoggingModule, DataModule, TypeOrmModule.forFeature([RoomEntity])],
    controllers: [ApiController],
    providers: [ApiService]
})
export class ApiModule { }
