import { Module } from '@nestjs/common';

import { HostGateway } from './gateway/host.gateway';
import { ClientGateway } from './gateway/client.gateway';
import { GenericGateway } from './gateway/generic.gateway';
import { RoomService } from './room/room.service';
import { AdminGateway } from './gateway/admin.gateway';
import { AdminService } from './admin/admin.service';

@Module({
    controllers: [],
    providers: [HostGateway, ClientGateway, GenericGateway, AdminGateway, RoomService, AdminService],
    exports: [RoomService],
})
export class LipwigModule {}
