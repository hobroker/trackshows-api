import { Module } from '@nestjs/common';
import { ConsoleModule as NestConsoleModule } from 'nestjs-console';
import { ConsoleService } from './console.service';
import { SyncModule } from '../sync';

@Module({
  imports: [NestConsoleModule, SyncModule],
  providers: [ConsoleService],
  exports: [ConsoleService],
})
export class ConsoleModule {}
