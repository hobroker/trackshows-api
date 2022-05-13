import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../prisma';
import { WatchlistModule } from '../watchlist';
import { TmdbModule } from '../tmdb';
import { NotificationService } from './services';
import { NotificationResolver } from './resolvers';
import { NotificationSchedulerService } from './services/notification-scheduler.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    WatchlistModule,
    TmdbModule,
  ],
  providers: [
    NotificationService,
    NotificationResolver,
    NotificationSchedulerService,
  ],
})
export class NotificationModule {}
