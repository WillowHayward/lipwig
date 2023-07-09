import { LipwigSummary, RoomSummary } from '@lipwig/model';
import { Controller, Get, Param } from '@nestjs/common';
import { AdminService } from '../service/admin.service';

@Controller('api/admin')
export class AdminController {
    constructor(private admin: AdminService) { }

    @Get('summary')
    summary(): Promise<LipwigSummary> {
        return this.admin.summary();
    }

    @Get('rooms')
    rooms(): Promise<RoomSummary[]> {
        return this.admin.rooms();
    }

    @Get('room/:id')
    room(@Param('id') id: string): Promise<RoomSummary> {
        return this.admin.room(id);
    }
}
