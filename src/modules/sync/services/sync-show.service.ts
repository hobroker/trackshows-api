import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { filter, pick, splitEvery } from 'rambda';
import { serialEvery, serial } from '../../../util/promise';
import { PrismaService } from '../../prisma';
import { ShowDetailsInterface, TmdbShowService } from '../../tmdb';
import { SyncHelper } from '../helpers';
import { handleError } from '../../logger/util';

const API_PARALLEL_LIMIT = 15;
const DB_PARALLEL_LIMIT = 200;

@Injectable()
export class SyncShowService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly syncHelper: SyncHelper,
    private readonly tmdbShowService: TmdbShowService,
  ) {
    this.updateShowDetails = this.updateShowDetails.bind(this);
  }

  async syncDetails(where: Prisma.ShowWhereInput) {
    this.logger.log('Syncing show details...');

    const externalShowIds: number[] = await this.syncHelper.findShowExternalIds(
      where,
    );

    const shows = await serialEvery<number, ShowDetailsInterface | void>(
      splitEvery(API_PARALLEL_LIMIT, externalShowIds),
      (id) =>
        this.tmdbShowService.getDetails(id).catch(handleError(this.logger)),
    ).then(filter<ShowDetailsInterface>(Boolean));

    await serial<ShowDetailsInterface[], void>(
      splitEvery(DB_PARALLEL_LIMIT, shows),
      this.syncHelper.syncRelatedEntities,
    );

    await serialEvery<ShowDetailsInterface, any>(
      splitEvery(DB_PARALLEL_LIMIT, shows),
      (show) => this.updateShowDetails(show),
    );

    this.logger.log(`Updated ${externalShowIds.length} shows`);
  }

  private async updateShowDetails({
    externalId,
    episodeRuntime,
    isInProduction,
    status,
    keywords,
    genres,
    productionCompanies,
    seasons,
  }: ShowDetailsInterface) {
    return this.prismaService.show.update({
      where: { externalId },
      data: {
        episodeRuntime,
        isInProduction,
        status: {
          connect: { name: status.name },
        },
        keywords: {
          connect: keywords.map(pick(['externalId'])),
        },
        genres: {
          connect: genres.map(pick(['externalId'])),
        },
        productionCompanies: {
          connect: productionCompanies.map(pick(['externalId'])),
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
