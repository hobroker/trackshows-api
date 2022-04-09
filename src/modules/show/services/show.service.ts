import { Injectable } from '@nestjs/common';
import { indexBy, prop } from 'rambda';
import { PartialShow } from '../entities';
import { TmdbGenreService, TmdbShowService } from '../../tmdb';
import { PrismaService } from '../../prisma';
import { Status } from '../../watchlist/entities';
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

  async linkStatus(
    userId: number,
    shows: PartialShow[],
  ): Promise<PartialShow[]> {
    const watchlist = await this.prismaService.watchlist
      .findMany({
        where: {
          userId,
          showId: {
            in: shows.map(prop('externalId')),
          },
        },
      })
      .then(indexBy(prop('showId')));

    return shows.map((show) => ({
      ...show,
      status: watchlist[show.externalId]?.statusId || Status.None,
    }));
  }
}
