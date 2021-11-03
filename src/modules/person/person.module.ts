import { Module } from '@nestjs/common';
import { GenderService } from './services';
import { GenderResolver } from './resolvers';
import { PrismaModule } from '../prisma';

@Module({
  imports: [PrismaModule],
  exports: [GenderService],
  providers: [GenderService, GenderResolver],
})
export class PersonModule {}
