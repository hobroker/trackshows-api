import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../prisma';
import { WatchlistModule } from '../watchlist';
import { TmdbModule } from '../tmdb';
import * as resolvers from './resolvers';
import * as services from './services';
import { NotificationSchedulerService } from './services';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    WatchlistModule,
    TmdbModule,
  ],
  providers: [...Object.values(resolvers), ...Object.values(services)],
  exports: [NotificationSchedulerService],
})
export class NotificationModule {}
