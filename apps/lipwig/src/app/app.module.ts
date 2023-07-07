import { Module } from '@nestjs/common';

import { LipwigModule } from '@lipwig/server';
import { LipwigAdminModule } from '@lipwig/admin';

@Module({
    imports: [LipwigModule, LipwigAdminModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
