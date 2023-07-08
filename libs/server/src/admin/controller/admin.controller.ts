import { LipwigSummary } from '@lipwig/model';
import { Controller, Get } from '@nestjs/common';
import { AdminService } from '../service/admin.service';

@Controller('admin')
export class AdminController {
    constructor(private admin: AdminService) { }

    @Get('summary')
    summary(): Promise<LipwigSummary> {
        return this.admin.summary();
    }
}
