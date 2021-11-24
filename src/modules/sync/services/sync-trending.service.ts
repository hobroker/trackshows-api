import { Injectable, Logger } from '@nestjs/common';
import {
  compose,
  dissoc,
  filter,
  map,
  prop,
  range,
  splitEvery,
  sum,
} from 'rambda';
import { serialEvery } from '../../../util/promise';
import { PrismaService } from '../../prisma';
import {
  PartialShowInterface,
  TmdbGenreService,
  TmdbShowService,
} from '../../tmdb';
import { SyncHelper } from '../helpers';
import { handleError } from '../../logger/util';

const PARALLEL_LIMIT = 10;

@Injectable()
export class SyncTrendingService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private prismaService: PrismaService,
    private syncHelper: SyncHelper,
    private tmdbShowService: TmdbShowService,
    private tmdbGenreService: TmdbGenreService,
  ) {
    this.addPartialShows = this.addPartialShows.bind(this);
  }

  async syncAllGenres() {
    this.logger.log('Adding genres');

    const genres = await this.tmdbGenreService.list();

    return this.prismaService.genre
      .createMany({
        data: genres,
        skipDuplicates: true,
      })
      .then(({ count }) => this.logger.log(`Added ${count} genres`))
      .catch(handleError(this.logger));
  }

  async syncTrending(
    startPageInclusive = 1,
    endPageExclusive = startPageInclusive + 1,
  ) {
    this.logger.log(`Syncing partial show details`);

    const pages = range(startPageInclusive, endPageExclusive);

    await serialEvery(splitEvery(PARALLEL_LIMIT, pages), (page) =>
      this.tmdbShowService
        .getTrending({ page })
        .then(this.addPartialShows)
        .catch(handleError(this.logger)),
    )
      .then(compose(sum, filter<number>(Boolean)))
      .then((count) => this.logger.log(`Added ${count} partial shows`));
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

    return showsToInsert.length;
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
