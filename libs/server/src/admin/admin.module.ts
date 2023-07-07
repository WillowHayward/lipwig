import { Module } from '@nestjs/common';
import { AdminGateway } from './gateway/admin.gateway';
import { AdminService } from './admin/admin.service';
import { LipwigModule } from '../lipwig/lipwig.module';
import { LoggingModule } from '../logging/logging.module';

@Module({
    imports: [LipwigModule, LoggingModule],
    controllers: [],
    providers: [AdminGateway, AdminService],
    exports: [],
})
export class LipwigAdminModule {}
