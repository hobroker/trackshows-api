import { Module } from '@nestjs/common';
import { GenderService, PersonService } from './services';
import { GenderResolver } from './resolvers';
import { PrismaModule } from '../prisma';
import { PersonResolver } from './resolvers/person.resolvers';

@Module({
  imports: [PrismaModule],
  exports: [GenderService],
  providers: [GenderService, GenderResolver, PersonService, PersonResolver],
})
export class PersonModule {}
