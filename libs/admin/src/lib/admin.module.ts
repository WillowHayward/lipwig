import { Module } from '@nestjs/common';
import { LipwigModule } from '@lipwig/server';
import { AdminGateway } from '../admin.gateway';
import { AdminService } from '../admin/admin.service';

@Module({
    imports: [LipwigModule],
    controllers: [],
    providers: [AdminGateway, AdminService],
    exports: [],
})
export class LipwigAdminModule {}
