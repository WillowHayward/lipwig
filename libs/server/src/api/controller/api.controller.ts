import { Controller, Get, Query } from '@nestjs/common';
import { ApiService } from '../service/api.service';
import { RoomQuery } from '@lipwig/model';

@Controller('api')
export class ApiController {
    constructor(private api: ApiService) {}

    @Get('query')
    query(@Query('code') code: string, @Query('id') id?: string): Promise<RoomQuery> {
        return this.api.query(code, id);
    }
}
