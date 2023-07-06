import { Module } from '@nestjs/common';

import { AppGateway } from './gateway/app.gateway';
import { RoomService } from './room/room.service';

@Module({
    controllers: [],
    providers: [AppGateway, RoomService],
    exports: [],
})
export class LipwigModule {}
