import { Injectable } from '@nestjs/common';
import { map, prop } from 'ramda';
import { Show } from '../entities';
import { TmdbGenreService, TmdbShowService } from '../../tmdb';
import { PrismaService } from '../../prisma';

@Injectable()
export class ShowService {
  constructor(
    private readonly tmdbGenreService: TmdbGenreService,
    private readonly tmdbShowService: TmdbShowService,
    private readonly prismaService: PrismaService,
  ) {}

  async getMyShows(userId: number): Promise<Show[]> {
    const externalIds: number[] = await this.prismaService.watchlist
      .findMany({
        where: { userId },
        select: { showId: true },
      })
      .then(map(prop('showId')));

    return this.tmdbShowService.getShows(externalIds);
  }

  async listRecommendations(
    userId: number,
    genreIds: number[],
  ): Promise<Show[]> {
    const excludedExternalIds: number[] = await this.prismaService.watchlist
      .findMany({
        where: { userId },
        select: { showId: true },
      })
      .then(map(prop('showId')));
    const trendingExternalIds: number[] = await this.tmdbShowService
      .getTrending()
      .then(map(prop('externalId')));

    const preferencesGenreIds =
      genreIds ||
      (await this.prismaService.preference
        .findFirst({ where: { userId }, select: { genreIds: true } })
        .then(prop('genreIds')));

    return this.tmdbShowService.discoverByGenres(preferencesGenreIds, {
      excludedExternalIds: [...excludedExternalIds, ...trendingExternalIds],
    });
  }
}
