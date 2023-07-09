import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './entities/room.entity';
import { LogEntity } from './entities/log.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'lipwig.db',
            entities: [RoomEntity, LogEntity],
            synchronize: true
        })
    ],
    exports: [TypeOrmModule]
})
export class DataModule { }
