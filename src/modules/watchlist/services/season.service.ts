import { Injectable } from '@nestjs/common';
import { all, prop } from 'ramda';
import { PrismaService } from '../../prisma';

@Injectable()
export class SeasonService {
  constructor(private readonly prismaService: PrismaService) {}

  getIsSeasonFullyWatched(showId: number, seasonNumber: number) {
    return this.prismaService.episode
      .findMany({
        where: {
          seasonNumber,
          watchlist: { showId },
        },
      })
      .then(all(prop('isWatched')));
  }
}
