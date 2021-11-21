import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { serial } from '../../../util/promise';
import { PrismaService } from '../../prisma';
import { TmdbShowService } from '../../tmdb';
import { SyncHelper } from '../helpers';
import { handleError } from '../../logger/util';

const PARALLEL_LIMIT = 15;

@Injectable()
export class SyncShowService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly syncHelper: SyncHelper,
    private readonly tmdbShowService: TmdbShowService,
  ) {}

  async syncDetails(where: Prisma.ShowWhereInput) {
    this.logger.log('Syncing show details');

    const externalShowIds: number[] = await this.syncHelper.findShowExternalIds(
      where,
    );

    await serial(
      externalShowIds.map(
        (externalShowId) => () =>
          this.updateShowDetails(externalShowId).catch(
            handleError(this.logger),
          ),
      ),
      PARALLEL_LIMIT,
    );

    this.logger.log(`Updated ${externalShowIds.length} shows`);
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
          connectOrCreate: seasons.map(({ externalId, ...rest }) => ({
            where: { externalId },
            create: { externalId, ...rest },
          })),
        },
      },
      select: { id: true },
    });
  }
}
