import { Injectable } from '@nestjs/common';
import { map, prop } from 'rambda';
import { PrismaService } from '../../prisma';
import { TmdbShowService } from '../../tmdb';
import { serial } from '../../../util/promise';

const PARALLEL_LIMIT = 10;

@Injectable()
export class SyncEpisodesService {
  constructor(
    private prismaService: PrismaService,
    private tmdbShowService: TmdbShowService,
  ) {
    this.updateShowEpisodes = this.updateShowEpisodes.bind(this);
  }

  async syncEpisodes(externalShowIds: number[]) {
    await serial(
      externalShowIds.map(
        (externalShowId) => () => this.updateShowEpisodes(externalShowId),
      ),
      PARALLEL_LIMIT,
    );

    return {
      count: 1,
    };
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
  }
}
