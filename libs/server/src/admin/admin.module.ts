import { Module } from '@nestjs/common';
import { AdminGateway } from './gateway/admin.gateway';
import { AdminService } from './service/admin.service';
import { LoggingModule } from '../logging/logging.module';
import { RoomModule } from '../room/room.module';

@Module({
    imports: [RoomModule, LoggingModule],
    controllers: [],
    providers: [AdminGateway, AdminService],
    exports: [],
})
export class AdminModule {}
