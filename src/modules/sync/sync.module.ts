import { Module } from '@nestjs/common';
import { SyncGenreService } from './services';
import { PrismaModule } from '../prisma';
import { TmdbModule } from '../tmdb';
import { SyncGenderService } from './services/sync-gender.service';

@Module({
  imports: [PrismaModule, TmdbModule],
  exports: [SyncGenreService, SyncGenderService],
  providers: [SyncGenreService, SyncGenderService],
})
export class SyncModule {}
