import { Module } from '@nestjs/common';
import { DataModule } from '../data/data.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from '../data/entities/room.entity';
import { LipwigLogger } from './logger/lipwig.logger';

@Module({
    imports: [DataModule, TypeOrmModule.forFeature([RoomEntity])],
    providers: [LipwigLogger],
    exports: [LipwigLogger]
})
export class LoggingModule { }
