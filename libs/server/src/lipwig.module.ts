import { Module } from '@nestjs/common';
import { RoomModule } from './room/room.module';
import { AdminModule } from './admin/admin.module';

@Module({
    imports: [RoomModule, AdminModule]
})
export class LipwigModule { }
