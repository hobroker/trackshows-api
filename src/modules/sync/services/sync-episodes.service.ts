import { Injectable, Logger } from '@nestjs/common';
import { prop, sum } from 'rambda';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma';
import { TmdbShowService } from '../../tmdb';
import { serial } from '../../../util/promise';
import { SyncHelper } from '../helpers';
import { handleError } from '../../logger/util';

const PARALLEL_LIMIT = 10;

@Injectable()
export class SyncEpisodesService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private prismaService: PrismaService,
    private syncHelper: SyncHelper,
    private tmdbShowService: TmdbShowService,
  ) {}

  async syncEpisodes(whereShow: Prisma.ShowWhereInput = {}) {
    this.logger.log('Syncing episodes...');

    const showIds = await this.syncHelper.findShowIds(whereShow);

    this.logger.log('showIds', showIds);

    return await serial(
      showIds.map(
        (showId) => () =>
          this.updateShowEpisodes(showId).catch(handleError(this.logger)),
      ),
      PARALLEL_LIMIT,
    )
      .then(sum)
      .then((count) => this.logger.log(`Synced ${count} episodes`));
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

    return Object.values(episodesMap).reduce(
      (acc, curr) => acc + curr.length,
      0,
    );
  }
}
