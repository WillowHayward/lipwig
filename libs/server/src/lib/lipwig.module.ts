import { Module } from '@nestjs/common';

import { HostGateway } from './gateway/host.gateway';
import { ClientGateway } from './gateway/client.gateway';
import { GenericGateway } from './gateway/generic.gateway';
import { RoomService } from './room/room.service';

@Module({
    controllers: [],
    providers: [HostGateway, ClientGateway, GenericGateway, RoomService],
    exports: [],
})
export class LipwigModule {}
