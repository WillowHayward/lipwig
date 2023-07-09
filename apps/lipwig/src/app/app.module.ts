import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { LipwigModule } from '@lipwig/server';

@Module({
    imports: [LipwigModule, ServeStaticModule.forRoot({
        rootPath: 'dist/apps/admin',
        serveRoot: '/admin'
    })],
    controllers: [],
    providers: [],
})
export class AppModule { }
