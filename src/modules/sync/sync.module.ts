import { Module } from '@nestjs/common';
import {
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
    SyncPersonService,
    SyncShowService,
    SyncCreditsService,
    SyncCacheService,
    SyncCleanService,
  ],
  providers: [
    SyncPersonService,
    SyncShowService,
    SyncCreditsService,
    SyncCacheService,
    SyncCleanService,
  ],
})
export class SyncModule {}
