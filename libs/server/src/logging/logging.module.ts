import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './entities/room.entity';
import { LipwigLogger } from './logger/logger.service';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'lipwig.db',
            entities: [RoomEntity],
            synchronize: true
        })
    ],
    providers: [LipwigLogger],
    exports: [TypeOrmModule, LipwigLogger]
})
export class LoggingModule { }
