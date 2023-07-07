import { Module } from '@nestjs/common';

import { LipwigAdminModule, LipwigModule } from '@lipwig/server';

@Module({
    imports: [LipwigModule, LipwigAdminModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
