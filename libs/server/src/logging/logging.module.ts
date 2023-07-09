import { Module } from '@nestjs/common';
import { DataModule } from '../data/data.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LipwigLogger } from './logger/lipwig.logger';
import { LogEntity } from '../data/entities/log.entity';

@Module({
    imports: [DataModule, TypeOrmModule.forFeature([LogEntity])],
    providers: [LipwigLogger],
    exports: [LipwigLogger]
})
export class LoggingModule { }
