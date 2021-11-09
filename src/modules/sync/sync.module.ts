import { Module } from '@nestjs/common';
import {
  SyncGenreService,
  SyncGenderService,
  SyncShowService,
} from './services';
import { PrismaModule } from '../prisma';
import { TmdbModule } from '../tmdb';

@Module({
  imports: [PrismaModule, TmdbModule],
  exports: [SyncGenreService, SyncGenderService, SyncShowService],
  providers: [SyncGenreService, SyncGenderService, SyncShowService],
})
export class SyncModule {}
