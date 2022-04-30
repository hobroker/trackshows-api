import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { TmdbModule } from '../tmdb';
import { ShowModule } from '../show';
import * as resolvers from './resolvers';
import * as services from './services';

@Module({
  imports: [PrismaModule, TmdbModule, ShowModule],
  providers: [...Object.values(resolvers), ...Object.values(services)],
})
export class ReviewModule {}
