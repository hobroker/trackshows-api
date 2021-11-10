import { Module } from '@nestjs/common';
import {
  SyncGenreService,
  SyncPersonService,
  SyncShowService,
} from './services';
import { PrismaModule } from '../prisma';
import { TmdbModule } from '../tmdb';

@Module({
  imports: [PrismaModule, TmdbModule],
  exports: [SyncGenreService, SyncPersonService, SyncShowService],
  providers: [SyncGenreService, SyncPersonService, SyncShowService],
})
export class SyncModule {}
