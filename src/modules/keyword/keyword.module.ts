import { Module } from '@nestjs/common';
import { KeywordService } from './services';
import { KeywordResolver } from './resolvers';
import { PrismaModule } from '../prisma';

@Module({
  imports: [PrismaModule],
  exports: [KeywordService],
  providers: [KeywordService, KeywordResolver],
})
export class KeywordModule {}
