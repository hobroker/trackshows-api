import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { TmdbModule } from '../tmdb';
import { GenreResolver, ShowResolver, SimilarResolver } from './resolvers';
import { ShowService, StatusService } from './services';

@Module({
  imports: [PrismaModule, TmdbModule],
  providers: [
    GenreResolver,
    ShowResolver,
    ShowService,
    SimilarResolver,
    StatusService,
  ],
  exports: [ShowService],
})
export class ShowModule {}
