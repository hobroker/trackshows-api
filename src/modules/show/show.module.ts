import { Module } from '@nestjs/common';
import { ShowService } from './services';
import { KeywordResolver } from './resolvers';
import { PrismaModule } from '../prisma';

@Module({
  imports: [PrismaModule],
  exports: [ShowService],
  providers: [ShowService, KeywordResolver],
})
export class ShowModule {}
