import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { prop } from 'ramda';
import { PrismaService } from '../../prisma';
import { StatsSummaryItem } from '../entities';
import { StatsSummaryItemKey } from '../entities/stats-summary-item';
import { Status } from '../../watchlist/entities';
import { TmdbShowService } from '../../tmdb';
import { StatsCalendarItem } from '../entities/stats-calendar-item';

@Injectable()
export class StatsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tmdbShowService: TmdbShowService,
  ) {}

  async getSummary(userId: number): Promise<StatsSummaryItem[]> {
    const watchlist = await this.prismaService.watchlist.findMany({
      where: {
        userId,
        statusId: { in: [Status.InWatchlist, Status.StoppedWatching] },
      },
      include: {
        episodes: {
          where: { isWatched: true },
          select: { id: true },
        },
      },
    });
    const shows = await this.tmdbShowService.getShows(
      watchlist.map(prop('showId')),
    );
    const showIdToEpisodeRuntime: Record<number, number> = shows.reduce(
      (acc, show) => ({
        ...acc,
        [show.externalId]: show.details.episodeRuntime,
      }),
      {},
    );
    const minutesSpent = watchlist.reduce(
      (acc, { showId, episodes }) =>
        acc + episodes.length * showIdToEpisodeRuntime[showId],
      0,
    );
    const episodes = watchlist.reduce(
      (acc, { episodes }) => [...acc, ...episodes],
      [],
    );

    return [
      {
        key: StatsSummaryItemKey.WatchingTvShowsCount,
        value: watchlist.length,
      },
      {
        key: StatsSummaryItemKey.WatchedEpisodesCount,
        value: episodes.length,
      },
      {
        key: StatsSummaryItemKey.SpentMinutes,
        value: minutesSpent,
      },
    ];
  }

  async getCalendarSummary(userId: number): Promise<StatsCalendarItem[]> {
    const watchlist = await this.prismaService.watchlist.findMany({
      where: {
        userId,
        statusId: { in: [Status.InWatchlist, Status.StoppedWatching] },
      },
      include: {
        episodes: {
          where: { isWatched: true },
          select: { updatedAt: true },
        },
      },
    });
    const episodes = watchlist.flatMap(prop('episodes'));
    const calendarItems: Record<string, number> = episodes.reduce(
      (acc, { updatedAt }) => {
        const date = DateTime.fromJSDate(updatedAt).toISODate();

        return {
          ...acc,
          [date]: acc[date] ? acc[date] + 1 : 1,
        };
      },
      {},
    );

    return Object.entries(calendarItems).map(([day, value]) => ({
      day,
      value,
    }));
  }
}
