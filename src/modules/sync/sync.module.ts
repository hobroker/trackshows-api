import { Module } from '@nestjs/common';
import {
  SyncCleanService,
  SyncEpisodesService,
  SyncPersonService,
  SyncShowService,
  SyncTrendingService,
} from './services';
import { PrismaModule } from '../prisma';
import { TmdbModule } from '../tmdb';
import { SyncHelper } from './helpers';

@Module({
  imports: [TmdbModule, PrismaModule],
  exports: [
    SyncPersonService,
    SyncShowService,
    SyncCleanService,
    SyncShowService,
    SyncTrendingService,
    SyncEpisodesService,
  ],
  providers: [
    SyncHelper,
    SyncPersonService,
    SyncShowService,
    SyncCleanService,
    SyncShowService,
    SyncTrendingService,
    SyncEpisodesService,
  ],
})
export class SyncModule {}
