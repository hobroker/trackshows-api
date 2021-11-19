import { Module } from '@nestjs/common';
import {
  SyncCleanService,
  SyncEpisodesService,
  SyncPersonService,
  SyncShowService,
  SyncHelperService,
} from './services';
import { PrismaModule } from '../prisma';
import { TmdbModule } from '../tmdb';

@Module({
  imports: [TmdbModule, PrismaModule],
  exports: [
    SyncPersonService,
    SyncShowService,
    SyncCleanService,
    SyncShowService,
    SyncEpisodesService,
  ],
  providers: [
    SyncHelperService,
    SyncPersonService,
    SyncShowService,
    SyncCleanService,
    SyncShowService,
    SyncEpisodesService,
  ],
})
export class SyncModule {}
