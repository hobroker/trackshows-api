import { Module } from '@nestjs/common';
import {
  SyncGenreService,
  SyncGenderService,
  SyncPersonService,
} from './services';
import { PrismaModule } from '../prisma';
import { TmdbModule } from '../tmdb';

@Module({
  imports: [PrismaModule, TmdbModule],
  exports: [SyncGenreService, SyncGenderService, SyncPersonService],
  providers: [SyncGenreService, SyncGenderService, SyncPersonService],
})
export class SyncModule {}
