import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { TmdbModule } from '../tmdb';
import { GenreResolver, ShowResolver } from './resolvers';
import { ShowService, StatusService } from './services';

@Module({
  imports: [PrismaModule, TmdbModule],
  providers: [GenreResolver, ShowResolver, ShowService, StatusService],
  exports: [ShowService],
})
export class ShowModule {}
