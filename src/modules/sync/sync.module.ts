import { Module } from '@nestjs/common';
import {
  SyncGenreService,
  SyncGenderService,
  SyncPersonService,
  SyncShowService,
} from './services';
import { PrismaModule } from '../prisma';
import { TmdbModule } from '../tmdb';

@Module({
  imports: [PrismaModule, TmdbModule],
  exports: [
    SyncGenreService,
    SyncGenderService,
    SyncPersonService,
    SyncShowService,
  ],
  providers: [
    SyncGenreService,
    SyncGenderService,
    SyncPersonService,
    SyncShowService,
  ],
})
export class SyncModule {}
