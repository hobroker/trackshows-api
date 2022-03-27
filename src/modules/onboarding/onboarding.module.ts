import { Module } from '@nestjs/common';
import { PreferenceService } from './services';
import { PrismaModule } from '../prisma';
import { OnboardingResolver } from './resolvers';

@Module({
  imports: [PrismaModule],
  exports: [PreferenceService],
  providers: [PreferenceService, OnboardingResolver],
})
export class OnboardingModule {}
