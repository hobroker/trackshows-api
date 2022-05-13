import { Injectable } from '@nestjs/common';
import { assoc, indexBy, prop, splitEvery } from 'ramda';
import { PrismaService } from '../../prisma';
import { TmdbEpisodeService } from '../../tmdb';
import { Notification } from '../entities';
import { serialEvery } from '../../../util/promise';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tmdbEpisodeService: TmdbEpisodeService,
  ) {}

  async getNotifications(userId: number): Promise<Notification[]> {
    const notifications = await this.prismaService.notification.findMany({
      where: { userId },
      include: {
        episode: {
          include: {
            watchlist: true,
          },
        },
      },
    });
    const episodeMap = await serialEvery(
      splitEvery(10, notifications),
      ({ episode }) =>
        this.tmdbEpisodeService
          .getDetails(
            episode.watchlist.showId,
            episode.seasonNumber,
            episode.episodeNumber,
          )
          .then(assoc('id', episode.id))
          .then(assoc('isWatched', episode.isWatched)),
    ).then(indexBy(prop('id')));

    return notifications.map(({ id, isRead, episodeId }) => ({
      id,
      isRead,
      episode: episodeMap[episodeId],
    }));
  }
}
