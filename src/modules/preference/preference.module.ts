import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { TmdbModule } from '../tmdb';
import { PreferenceService } from './services';
import { PreferenceResolver } from './resolvers';

@Module({
  imports: [PrismaModule, TmdbModule],
  exports: [PreferenceService],
  providers: [PreferenceService, PreferenceResolver],
})
export class PreferenceModule {}
