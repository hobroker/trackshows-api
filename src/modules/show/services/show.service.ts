import { Injectable } from '@nestjs/common';
import { indexBy, map, prop } from 'ramda';
import { PartialShow } from '../entities';
import { TmdbGenreService, TmdbShowService } from '../../tmdb';
import { PrismaService } from '../../prisma';
import { __ShowChild } from '../entities/episode';

@Injectable()
export class ShowService {
  constructor(
    private readonly tmdbGenreService: TmdbGenreService,
    private readonly tmdbShowService: TmdbShowService,
    private readonly prismaService: PrismaService,
  ) {
    this.linkGenres = this.linkGenres.bind(this);
    this.linkShows = this.linkShows.bind(this);
    this.linkShow = this.linkShow.bind(this);
  }

  async linkGenres<T extends PartialShow>(data: T[]): Promise<T[]> {
    const genres = await this.tmdbGenreService
      .list()
      .then(indexBy(prop('externalId')));

    return data.map((item) => ({
      ...item,
      genres: item.__meta__.genreIds.map((id) => genres[id]),
    }));
  }

  async linkShows<T extends __ShowChild>(data: T[]): Promise<T[]> {
    const shows = await Promise.all(
      data.map(({ __meta__: { showId } }) =>
        this.tmdbShowService.getShow(showId),
      ),
    ).then(indexBy(prop('externalId')));

    return data.map((item) => ({
      ...item,
      show: shows[item.__meta__.showId],
    }));
  }

  async linkShow<T extends __ShowChild>(item: T): Promise<T> {
    if (!item) {
      return null;
    }

    return this.linkShows([item]).then(([item]) => item);
  }

  async getMyShows(userId: number): Promise<PartialShow[]> {
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
  ): Promise<PartialShow[]> {
    const excludedExternalIds: number[] = await this.prismaService.watchlist
      .findMany({ where: { userId }, select: { showId: true } })
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
