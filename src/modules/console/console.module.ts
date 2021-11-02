import { Module } from '@nestjs/common';
import { ConsoleModule as NestConsoleModule } from 'nestjs-console';
import { ConsoleService, ConsoleSetupService } from './services';
import { SyncModule } from '../sync';
import { PrismaModule } from '../prisma';

@Module({
  imports: [NestConsoleModule, SyncModule, PrismaModule],
  providers: [ConsoleSetupService, ConsoleService],
  exports: [ConsoleService],
})
export class ConsoleModule {}
