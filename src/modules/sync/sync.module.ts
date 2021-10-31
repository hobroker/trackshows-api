import { Module } from '@nestjs/common';
import { SyncGenreService } from './services';
import { PrismaModule } from '../prisma';
import { TmdbModule } from '../tmdb';

@Module({
  imports: [PrismaModule, TmdbModule],
  exports: [SyncGenreService],
  providers: [SyncGenreService],
})
export class SyncModule {}
