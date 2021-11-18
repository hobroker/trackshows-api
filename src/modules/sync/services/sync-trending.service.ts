import { Injectable } from '@nestjs/common';
import { concat, dissoc, map, objOf, prop, range, reduce } from 'rambda';
import { PrismaService } from '../../prisma';
import { RawPartialShowInterface, TmdbShowService } from '../../tmdb';
import { serial } from '../../../util/promise';

@Injectable()
export class SyncTrendingService {
  private allExternalGenresIds: number[];

  constructor(
    private prismaService: PrismaService,
    private tmdbShowService: TmdbShowService,
  ) {
    this.addShows = this.addShows.bind(this);
  }

  async syncTrending(
    startPageInclusive = 1,
    endPageExclusive = startPageInclusive + 1,
  ) {
    const pages = range(startPageInclusive, endPageExclusive);

    await this.setAllExternalGenresIds();
    const results = await serial<number[]>(
      pages.map(
        (page) => async () =>
          this.tmdbShowService.getTrending({ page }).then(this.addShows),
      ),
      10,
    ).then(reduce<number[], number[]>(concat, []));

    return {
      count: results.length,
      data: results,
    };
  }

  private async addShows(shows: RawPartialShowInterface[]) {
    const showsToInsert = await this.excludeExistingShows(shows).then(
      map<RawPartialShowInterface>(dissoc('externalGenresIds')),
    );

    await this.prismaService.show.createMany({
      data: showsToInsert,
      skipDuplicates: true,
    });

    await this.linkGenres(shows);

    return showsToInsert.map(prop('externalId'));
  }

  private async setAllExternalGenresIds() {
    this.allExternalGenresIds = await this.prismaService.genre
      .findMany({ select: { externalId: true } })
      .then(map(prop('externalId')));
  }

  private excludeMissingGenreIds(externalGenresIds: number[]) {
    return externalGenresIds
      .filter((externalId) => this.allExternalGenresIds.includes(externalId))
      .map(objOf('externalId'));
  }

  private async linkGenres(shows: RawPartialShowInterface[]) {
    await Promise.all(
      shows.map(({ externalId, externalGenresIds }) =>
        this.prismaService.show.update({
          where: { externalId },
          data: {
            genres: {
              connect: this.excludeMissingGenreIds(externalGenresIds),
            },
          },
        }),
      ),
    );
  }

  private excludeExistingShows(
    shows: RawPartialShowInterface[],
  ): Promise<RawPartialShowInterface[]> {
    return this.prismaService.show
      .findMany({
        where: {
          externalId: { in: shows.map(prop('externalId')) },
        },
        select: {
          externalId: true,
        },
      })
      .then(map(prop('externalId')))
      .then((existingShows) =>
        shows.filter(({ externalId }) => !existingShows.includes(externalId)),
      );
  }
}
