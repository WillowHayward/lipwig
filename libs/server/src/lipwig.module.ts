import { Module } from '@nestjs/common';
import { RoomModule } from './room/room.module';
import { ApiModule } from './api/api.module';

@Module({
    imports: [RoomModule, ApiModule],
})
export class LipwigModule {}
