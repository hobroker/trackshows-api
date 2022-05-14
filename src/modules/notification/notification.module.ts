import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma';
import { WatchlistModule } from '../watchlist';
import { TmdbModule } from '../tmdb';
import { GoogleModule } from '../google';
import { googleConfig } from '../google/google.config';
import * as resolvers from './resolvers';
import * as services from './services';
import { NotificationSchedulerService } from './services';

@Module({
  imports: [
    ConfigModule.forFeature(googleConfig),
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
