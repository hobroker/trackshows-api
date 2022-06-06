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
    const isInWatchlist = await this.watchlistService.isShowInWatchlist(
      userId,
      showId,
    );

    if (!isInWatchlist) return false;

    return this.prismaService.episode
      .findMany({
        where: {
          seasonNumber,
          watchlist: { showId, userId },
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
