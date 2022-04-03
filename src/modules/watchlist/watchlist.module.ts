import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { WatchlistResolver } from './resolvers';
import { WatchlistService } from './services';

@Module({
  imports: [PrismaModule],
  providers: [WatchlistResolver, WatchlistService],
})
export class WatchlistModule {}
