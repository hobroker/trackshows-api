import { Injectable } from '@nestjs/common';
import { all, prop } from 'ramda';
import { PrismaService } from '../../prisma';

@Injectable()
export class SeasonService {
  constructor(private readonly prismaService: PrismaService) {}

  getIsSeasonFullyWatched(
    userId: number,
    showId: number,
    seasonNumber: number,
  ) {
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
