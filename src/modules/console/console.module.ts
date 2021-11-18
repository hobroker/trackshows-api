import { Module } from '@nestjs/common';
import { ConsoleModule as NestConsoleModule } from 'nestjs-console';
import { ConfigModule } from '@nestjs/config';
import {
  ConsoleCleanService,
  ConsoleSeedService,
  ConsoleSetupService,
} from './services';
import { SyncModule } from '../sync';
import { PrismaModule } from '../prisma';
import { consoleConfig } from './console.config';

@Module({
  imports: [
    ConfigModule.forFeature(consoleConfig),
    NestConsoleModule,
    SyncModule,
    PrismaModule,
  ],
  providers: [ConsoleSetupService, ConsoleSeedService, ConsoleCleanService],
  exports: [],
})
export class ConsoleModule {}
