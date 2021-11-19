import { Injectable } from '@nestjs/common';
import { compose, map, objOf, prop, sum } from 'rambda';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma';
import { TmdbShowService } from '../../tmdb';
import { serial } from '../../../util/promise';
import { SyncHelperService } from './sync-helper.service';

const PARALLEL_LIMIT = 10;
const createCount = compose(objOf('count'), sum, map(prop('count')));

@Injectable()
export class SyncEpisodesService {
  constructor(
    private prismaService: PrismaService,
    private syncHelperService: SyncHelperService,
    private tmdbShowService: TmdbShowService,
  ) {}

  async syncEpisodes(whereShow: Prisma.ShowWhereInput = {}) {
    const externalShowIds = await this.syncHelperService.findExternalShowIds(
      whereShow,
    );

    return await serial(
      externalShowIds.map(
        (externalShowId) => () => this.updateShowEpisodes(externalShowId),
      ),
      PARALLEL_LIMIT,
    ).then(createCount);
  }

  private async updateShowEpisodes(externalId: number) {
    const seasonNumbers: number[] = await this.prismaService.show
      .findFirst({
        where: { externalId },
        select: {
          seasons: {
            select: { number: true },
          },
        },
      })
      .then(prop('seasons'))
      .then(map(prop('number')));

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
