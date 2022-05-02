import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { TmdbModule } from '../tmdb';
import { GenreResolver, ShowResolver, SimilarResolver } from './resolvers';
import { ShowService } from './services';

@Module({
  imports: [PrismaModule, TmdbModule],
  providers: [GenreResolver, ShowResolver, ShowService, SimilarResolver],
  exports: [ShowService],
})
export class ShowModule {}
