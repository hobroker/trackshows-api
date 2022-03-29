import { Module } from '@nestjs/common';
import { ShowService } from './services';
import { GenreResolver } from './resolvers';
import { PrismaModule } from '../prisma';
import { TmdbModule } from '../tmdb';

@Module({
  imports: [PrismaModule, TmdbModule],
  exports: [ShowService],
  providers: [ShowService, GenreResolver],
})
export class ShowModule {}
