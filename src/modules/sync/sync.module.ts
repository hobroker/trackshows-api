import { Module } from '@nestjs/common';
import {
  SyncGenreService,
  SyncPersonService,
  SyncShowService,
  SyncCreditsService,
  SyncCacheService,
  SyncCleanService,
} from './services';
import { PrismaModule } from '../prisma';
import { TmdbModule } from '../tmdb';

@Module({
  imports: [PrismaModule, TmdbModule],
  exports: [
    SyncGenreService,
    SyncPersonService,
    SyncShowService,
    SyncCreditsService,
    SyncCacheService,
    SyncCleanService,
  ],
  providers: [
    SyncGenreService,
    SyncPersonService,
    SyncShowService,
    SyncCreditsService,
    SyncCacheService,
    SyncCleanService,
  ],
})
export class SyncModule {}
