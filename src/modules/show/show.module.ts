import { Module } from '@nestjs/common';
import { GenreService, ShowService } from './services';
import { GenreResolver, ShowResolver } from './resolvers';
import { PrismaModule } from '../prisma';
import { TmdbModule } from '../tmdb';

@Module({
  imports: [PrismaModule, TmdbModule],
  exports: [ShowService, GenreService],
  providers: [ShowService, ShowResolver, GenreService, GenreResolver],
})
export class ShowModule {}
