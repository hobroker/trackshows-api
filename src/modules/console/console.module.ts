import { Module } from '@nestjs/common';
import { ConsoleModule as NestConsoleModule } from 'nestjs-console';
import { ConsoleService } from './console.service';
import { TmdbModule } from '../tmdb';

@Module({
  imports: [NestConsoleModule, TmdbModule],
  providers: [ConsoleService],
  exports: [ConsoleService],
})
export class ConsoleModule {}
