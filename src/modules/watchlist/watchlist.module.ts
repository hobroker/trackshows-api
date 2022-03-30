import { Module } from '@nestjs/common';
import { WatchlistResolver } from './resolvers';
import { WatchlistService } from './services';
import { PrismaModule } from '../prisma';

@Module({
  imports: [PrismaModule],
  providers: [WatchlistResolver, WatchlistService],
})
export class WatchlistModule {}
