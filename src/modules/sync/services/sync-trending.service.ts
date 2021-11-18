import { Injectable } from '@nestjs/common';
import { compose, dissoc, map, objOf, prop, range, sum } from 'rambda';
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
    const count = await serial<{ count: number }>(
      pages.map(
        (page) => async () =>
          this.tmdbShowService.getTrending({ page }).then(this.addShows),
      ),
      10,
    ).then(compose(sum, map(prop('count'))));

    return { count };
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

    return {
      count: showsToInsert.length,
    };
  }

  private async setAllExternalGenresIds() {
    this.allExternalGenresIds = await this.prismaService.genre
      .findMany({ select: { externalId: true } })
      .then(map(prop('externalId')));
  }

  private async linkGenres(shows: RawPartialShowInterface[]) {
    await Promise.all(
      shows
        .map(({ externalId, externalGenresIds }) => ({
          externalId,
          genresInput: externalGenresIds
            .map(objOf('externalId'))
            .filter(({ externalId }) =>
              this.allExternalGenresIds.includes(externalId),
            ),
        }))
        .map(({ externalId, genresInput }) =>
          this.prismaService.show.update({
            where: { externalId },
            data: {
              genres: {
                connect: genresInput,
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
