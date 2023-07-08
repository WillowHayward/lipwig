import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './entities/room.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'lipwig.db',
            entities: [RoomEntity],
            synchronize: true
        })
    ],
    exports: [TypeOrmModule]
})
export class DataModule { }
