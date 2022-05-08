import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { TmdbModule } from '../tmdb';
import { SearchService } from './services';
import { SearchResolver } from './resolvers';

@Module({
  imports: [PrismaModule, TmdbModule],
  providers: [SearchService, SearchResolver],
})
export class SearchModule {}
