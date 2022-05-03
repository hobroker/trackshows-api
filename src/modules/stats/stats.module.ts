import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { TmdbModule } from '../tmdb';
import { StatsService } from './services';
import { StatsResolver } from './resolvers';

@Module({
  imports: [PrismaModule, TmdbModule],
  providers: [StatsService, StatsResolver],
})
export class StatsModule {}
