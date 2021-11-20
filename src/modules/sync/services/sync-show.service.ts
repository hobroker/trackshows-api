import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { serial } from '../../../util/promise';
import { PrismaService } from '../../prisma';
import { TmdbShowService } from '../../tmdb';
import { SyncHelper } from '../helpers';

const PARALLEL_LIMIT = 10;

@Injectable()
export class SyncShowService {
  constructor(
    private prismaService: PrismaService,
    private syncHelper: SyncHelper,
    private tmdbShowService: TmdbShowService,
  ) {}

  async syncDetails(where: Prisma.ShowWhereInput) {
    const externalShowIds: number[] = await this.syncHelper.findShowExternalIds(
      where,
    );

    await serial(
      externalShowIds.map(
        (externalShowId) => () => this.updateShowDetails(externalShowId),
      ),
      PARALLEL_LIMIT,
    );

    return {
      count: externalShowIds.length,
    };
  }

  private async updateShowDetails(externalId: number) {
    const {
      episodeRuntime,
      isInProduction,
      status,
      keywords,
      productionCompanies,
      seasons,
    } = await this.tmdbShowService.getDetails(externalId);

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
}
