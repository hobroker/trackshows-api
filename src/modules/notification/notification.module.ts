import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { TmdbModule } from '../tmdb';
import { NotificationService } from './services';
import { NotificationResolver } from './resolvers';

@Module({
  imports: [PrismaModule, TmdbModule],
  providers: [NotificationService, NotificationResolver],
})
export class NotificationModule {}
