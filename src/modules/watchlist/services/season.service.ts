import { Injectable } from '@nestjs/common';
import { all, prop } from 'ramda';
import { PrismaService } from '../../prisma';
import { WatchlistService } from './watchlist.service';

@Injectable()
export class SeasonService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly watchlistService: WatchlistService,
  ) {}

  async getIsSeasonFullyWatched(
    userId: number,
    showId: number,
    seasonNumber: number,
  ) {
    const watchlist = await this.watchlistService.findWatchlist(userId, showId);

    if (!watchlist) return false;

    return this.prismaService.episode
      .findMany({
        where: {
          seasonNumber,
          watchlistId: watchlist.id,
        },
      })
      .then(all(prop('isWatched')));
  }

  async toggleSeasonIsFullyWatched(
    userId: number,
    showId: number,
    seasonNumber: number,
  ) {
    const isSeasonFullyWatched = await this.getIsSeasonFullyWatched(
      userId,
      showId,
      seasonNumber,
    );

    return this.prismaService.episode.updateMany({
      where: {
        seasonNumber,
        watchlist: { showId, userId },
      },
      data: { isWatched: !isSeasonFullyWatched },
    });
  }
}
