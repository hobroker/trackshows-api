import { Module } from '@nestjs/common';
import { PreferenceService } from './services';
import { PrismaModule } from '../prisma';
import { OnboardingResolver } from './resolvers';
import { TmdbModule } from '../tmdb';

@Module({
  imports: [PrismaModule, TmdbModule],
  exports: [PreferenceService],
  providers: [PreferenceService, OnboardingResolver],
})
export class OnboardingModule {}
