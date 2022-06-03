import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma';
import { WatchlistModule } from '../watchlist';
import { TmdbModule } from '../tmdb';
import { GoogleModule } from '../google';
import * as resolvers from './resolvers';
import * as services from './services';
import { NotificationSchedulerService } from './services';
import { notificationConfig } from './notification.config';

@Module({
  imports: [
    ConfigModule.forFeature(notificationConfig),
    ScheduleModule.forRoot(),
    PrismaModule,
    WatchlistModule,
    TmdbModule,
    GoogleModule,
  ],
  providers: [...Object.values(resolvers), ...Object.values(services)],
  exports: [NotificationSchedulerService],
})
export class NotificationModule {}
