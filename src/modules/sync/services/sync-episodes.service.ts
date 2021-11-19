import { Injectable } from '@nestjs/common';
import { compose, map, objOf, prop, sum } from 'rambda';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma';
import { TmdbShowService } from '../../tmdb';
import { serial } from '../../../util/promise';
import { SyncHelper } from '../helpers';

const PARALLEL_LIMIT = 10;
const createCount = compose(objOf('count'), sum, map(prop('count')));

@Injectable()
export class SyncEpisodesService {
  constructor(
    private prismaService: PrismaService,
    private syncHelper: SyncHelper,
    private tmdbShowService: TmdbShowService,
  ) {}

  async syncEpisodes(whereShow: Prisma.ShowWhereInput = {}) {
    const showIds = await this.syncHelper.findShowIds(whereShow);

    return await serial(
      showIds.map((showId) => () => this.updateShowEpisodes(showId)),
      PARALLEL_LIMIT,
    ).then(createCount);
  }

  private async updateShowEpisodes(showId: number) {
    const { externalId, seasons } = await this.prismaService.show.findFirst({
      where: { id: showId },
      select: {
        externalId: true,
        seasons: {
          select: { number: true },
        },
      },
    });

    const seasonNumbers: number[] = seasons.map(prop('number'));

    const episodesMap = await this.tmdbShowService.getEpisodesMap(
      externalId,
      seasonNumbers,
    );

    await Promise.all(
      Object.entries(episodesMap).map(([seasonExternalId, episodes]) =>
        this.prismaService.season.update({
          where: { externalId: Number(seasonExternalId) },
          data: {
            updatedAt: new Date(),
            episodes: {
              upsert: episodes.map(({ externalId, ...rest }) => ({
                where: { externalId },
                create: { externalId, ...rest },
                update: rest,
              })),
            },
          },
          select: { id: true },
        }),
      ),
    );

    return {
      count: Object.values(episodesMap).reduce(
        (acc, curr) => acc + curr.length,
        0,
      ),
    };
  }
}
