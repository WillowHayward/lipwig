import { Module } from '@nestjs/common';
import { AdminGateway } from './gateway/admin.gateway';
import { AdminService } from './admin/admin.service';
import { LipwigModule } from '../lipwig/lipwig.module';

@Module({
    imports: [LipwigModule],
    controllers: [],
    providers: [AdminGateway, AdminService],
    exports: [],
})
export class LipwigAdminModule {}
