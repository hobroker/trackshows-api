import { forwardRef, Module } from '@nestjs/common';
import {
  SyncCleanService,
  SyncPersonService,
  SyncShowService,
  SyncTrendingService,
} from './services';
import { PrismaModule } from '../prisma';
import { TmdbModule } from '../tmdb';

@Module({
  imports: [forwardRef(() => TmdbModule), PrismaModule],
  exports: [
    SyncPersonService,
    SyncShowService,
    SyncCleanService,
    SyncTrendingService,
  ],
  providers: [
    SyncPersonService,
    SyncShowService,
    SyncCleanService,
    SyncTrendingService,
  ],
})
export class SyncModule {}
