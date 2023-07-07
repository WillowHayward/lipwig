import { Module } from '@nestjs/common';
import { LipwigModule } from '@lipwig/server';

@Module({
    imports: [LipwigModule],
    controllers: [],
    providers: [],
    exports: [],
})
export class LipwigAdminModule {}
