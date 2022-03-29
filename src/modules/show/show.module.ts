import { Module } from '@nestjs/common';
import { GenreResolver, ShowResolver } from './resolvers';
import { PrismaModule } from '../prisma';
import { TmdbModule } from '../tmdb';

@Module({
  imports: [PrismaModule, TmdbModule],
  providers: [GenreResolver, ShowResolver],
})
export class ShowModule {}
