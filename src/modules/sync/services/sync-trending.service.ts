import { Injectable } from '@nestjs/common';
import { dissoc, flatten, map, objOf, prop, range, splitEvery } from 'rambda';
import { PrismaService } from '../../prisma';
import { RawPartialShowInterface, TmdbShowService } from '../../tmdb';
import { serial } from '../../../util/promise';

@Injectable()
export class SyncTrendingService {
  constructor(
    private prismaService: PrismaService,
    private tmdbShowService: TmdbShowService,
  ) {
    this.excludeExistingShows = this.excludeExistingShows.bind(this);
  }

  async sync(
    startPageInclusive = 1,
    endPageExclusive = startPageInclusive + 1,
  ) {
    const pages = range(startPageInclusive, endPageExclusive);
    const shows = await serial(
      pages.map((page) => () => this.tmdbShowService.getTrending({ page })),
    ).then((results) => flatten<RawPartialShowInterface>(results));

    const showsToInsertInChunks = await this.excludeExistingShows(shows)
      .then((data) =>
        data.map<RawPartialShowInterface>(dissoc('externalGenresIds')),
      )
      .then((data) => splitEvery<RawPartialShowInterface>(200, data));

    await serial(
      showsToInsertInChunks.map(
        (items) => () =>
          this.prismaService.show.createMany({
            data: items,
            skipDuplicates: true,
          }),
      ),
    );

    await this.syncGenres(shows);
  }

  async syncGenres(shows: RawPartialShowInterface[]) {
    const allExternalGenresIds = await this.prismaService.genre
      .findMany({ select: { externalId: true } })
      .then(map(prop('externalId')));

    await serial(
      shows.map(
        ({ externalId, externalGenresIds }) =>
          () =>
            this.prismaService.show.update({
              where: { externalId },
              data: {
                genres: {
                  connect: externalGenresIds
                    .map(objOf('externalId'))
                    .filter(({ externalId }) =>
                      allExternalGenresIds.includes(externalId),
                    ),
                },
              },
            }),
      ),
      20,
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
