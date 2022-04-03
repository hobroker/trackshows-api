import { Injectable } from '@nestjs/common';
import { indexBy, prop } from 'rambda';
import { PartialShow } from '../entities';
import { TmdbGenreService } from '../../tmdb';
import { PrismaService } from '../../prisma';
import { Status } from '../../watchlist/entities';

type PartialShowWithGenreIds = PartialShow & { genreIds: number[] };

@Injectable()
export class ShowService {
  constructor(
    private readonly tmdbGenreService: TmdbGenreService,
    private readonly prismaService: PrismaService,
  ) {
    this.linkGenres = this.linkGenres.bind(this);
  }

  async linkGenres(shows: PartialShowWithGenreIds[]): Promise<PartialShow[]> {
    const genres = await this.tmdbGenreService
      .list()
      .then(indexBy(prop('externalId')));

    return shows.map(({ genreIds, ...show }) => ({
      ...show,
      genres: genreIds.map((id) => genres[id]),
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
