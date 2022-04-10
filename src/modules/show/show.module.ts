import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { TmdbModule } from '../tmdb';
import { GenreResolver, ShowResolver } from './resolvers';
import { ShowService } from './services';

@Module({
  imports: [PrismaModule, TmdbModule],
  providers: [GenreResolver, ShowResolver, ShowService],
  exports: [ShowService],
})
export class ShowModule {}
