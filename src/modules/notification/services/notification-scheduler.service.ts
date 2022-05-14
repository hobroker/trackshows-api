import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Watchlist, Prisma } from '@prisma/client';
import { filter, splitEvery } from 'ramda';
import { PrismaService } from '../../prisma';
import { Episode } from '../../show/entities/episode';
import { EpisodeService } from '../../watchlist/services';
import { Status } from '../../watchlist/entities';
import { serialEvery } from '../../../util/promise';

@Injectable()
export class NotificationSchedulerService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly episodeService: EpisodeService,
  ) {
    this.findNewEpisode = this.findNewEpisode.bind(this);
  }

  @Cron('0 0 * * * *')
  async refreshNotifications() {
    const users = await this.prismaService.user.findMany();

    await serialEvery(splitEvery(10, users), async (user) => {
      const episodes = await this.findNewEpisodesForUser(user.id);
      const { count } = await this.createNotificationsFromEpisodes(
        user.id,
        episodes,
      );

      this.logger.debug(`Created ${count} notifications for user=${user.id}`);
    });
  }

  private async findNewEpisodesForUser(userId): Promise<Episode[]> {
    const watchlist = await this.prismaService.watchlist.findMany({
      where: { userId, statusId: Status.InWatchlist },
    });

    return Promise.all(watchlist.map(this.findNewEpisode)).then(
      filter(Boolean),
    );
  }

  private async findNewEpisode(watchlist: Watchlist): Promise<Episode | null> {
    return this.episodeService.findEpisodeInWatchlist(watchlist, {
      airDate: {
        lte: new Date(),
        gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      },
    });
  }

  private createNotificationsFromEpisodes(userId: number, episodes: Episode[]) {
    const data: Prisma.NotificationUncheckedCreateInput[] = episodes.map(
      ({ id }) => ({
        userId,
        episodeId: id,
        isRead: false,
      }),
    );

    return this.prismaService.notification.createMany({
      data,
      skipDuplicates: true,
    });
  }
}
