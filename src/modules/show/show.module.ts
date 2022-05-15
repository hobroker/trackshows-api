import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { TmdbModule } from '../tmdb';
import * as resolvers from './resolvers';
import { ShowService, StatusService } from './services';

@Module({
  imports: [PrismaModule, TmdbModule],
  providers: [...Object.values(resolvers), ShowService, StatusService],
  exports: [ShowService],
})
export class ShowModule {}
