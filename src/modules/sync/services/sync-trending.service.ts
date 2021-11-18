import { Injectable } from '@nestjs/common';
import { concat, dissoc, map, objOf, prop, range, reduce } from 'rambda';
import { PrismaService } from '../../prisma';
import { PartialShowInterface, TmdbShowService } from '../../tmdb';
import { serial } from '../../../util/promise';

@Injectable()
export class SyncTrendingService {
  private allExternalGenresIds: number[];

  constructor(
    private prismaService: PrismaService,
    private tmdbShowService: TmdbShowService,
  ) {
    this.addPartialShows = this.addPartialShows.bind(this);
    this.updateShowDetails = this.updateShowDetails.bind(this);
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
          this.tmdbShowService.getTrending({ page }).then(this.addPartialShows),
      ),
      10,
    ).then(reduce<number[], number[]>(concat, []));

    return {
      count: results.length,
      data: results,
    };
  }

  async linkDetails(externalShowIds: number[]) {
    await Promise.all(externalShowIds.map(this.updateShowDetails));

    return {
      count: 1,
    };
  }

  private async addPartialShows(shows: PartialShowInterface[]) {
    const showsToInsert: Omit<PartialShowInterface, 'externalGenresIds'>[] =
      await this.excludeExistingShows(shows).then(
        map(dissoc('externalGenresIds')),
      );

    await this.prismaService.show.createMany({
      data: showsToInsert,
      skipDuplicates: true,
    });

    await this.linkGenres(shows);

    return showsToInsert.map(prop('externalId'));
  }

  private async updateShowDetails(externalId) {
    const {
      episodeRuntime,
      isInProduction,
      status,
      keywords,
      productionCompanies,
      seasons,
    } = await this.tmdbShowService.getDetails(externalId);

    console.log('episodeRuntime', episodeRuntime);

    await this.prismaService.show.update({
      where: { externalId },
      data: {
        episodeRuntime,
        isInProduction,
        status: {
          connectOrCreate: {
            where: { name: status.name },
            create: { name: status.name },
          },
        },
        keywords: {
          connectOrCreate: keywords.map(({ externalId, ...rest }) => ({
            where: { externalId },
            create: { externalId, ...rest },
          })),
        },
        productionCompanies: {
          connectOrCreate: productionCompanies.map(
            ({ externalId, ...rest }) => ({
              where: { externalId },
              create: { externalId, ...rest },
            }),
          ),
        },
        seasons: {
          upsert: seasons.map(({ externalId, ...rest }) => ({
            where: { externalId },
            create: { externalId, ...rest },
            update: rest,
          })),
        },
      },
      select: { id: true },
    });
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

  private async linkGenres(shows: PartialShowInterface[]) {
    await Promise.all(
      shows.map(({ externalId, externalGenresIds }) =>
        this.prismaService.show.update({
          where: { externalId },
          data: {
            genres: {
              connect: this.excludeMissingGenreIds(externalGenresIds),
            },
          },
          select: { id: true },
        }),
      ),
    );
  }

  private excludeExistingShows(
    shows: PartialShowInterface[],
  ): Promise<PartialShowInterface[]> {
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
