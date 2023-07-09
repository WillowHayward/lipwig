/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { defaultConfig } from '@lipwig/server';

import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: true // TODO: Remove for prod
    });
    app.useWebSocketAdapter(new WsAdapter(app));
    const port = defaultConfig.port;
    await app.listen(port);
    Logger.log(`Lipwig server is running on: ws://localhost:${port}`);
}

bootstrap();
