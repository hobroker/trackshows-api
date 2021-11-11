import { Inject, Injectable } from '@nestjs/common';
import { assoc, map, pick, prop } from 'rambda';
import { PrismaService } from '../../prisma';
import { TmdbShowService } from '../../tmdb';
import { SyncCacheService } from './sync-cache.service';
import { SyncCreditsService } from './sync-credits.service';

@Injectable()
export class SyncShowService {
  @Inject(TmdbShowService)
  private tmdbShowService: TmdbShowService;

  @Inject(SyncCacheService)
  private syncCacheService: SyncCacheService;

  @Inject(SyncCreditsService)
  private syncCreditsService: SyncCreditsService;

  @Inject(PrismaService)
  private prismaService: PrismaService;

  async syncOne(showExternalId: number) {
    let show = await this.prismaService.show.findUnique({
      where: { externalId: showExternalId },
    });

    if (!show) {
      show = await this.createShow(showExternalId);
    }

    await this.createShowEpisodes(showExternalId);
    await this.syncCreditsService.sync(show.id, showExternalId);
  }

  private async createShow(externalId: number) {
    const { status, seasons, genres, keywords, productionCompanies, ...show } =
      await this.tmdbShowService.getDetails(externalId);

    const statusId: number = await this.syncCacheService.getStatusIdByName(
      status.name,
    );

    await this.prismaService.genre.createMany({
      data: genres,
      skipDuplicates: true,
    });

    await this.prismaService.keyword.createMany({
      data: keywords,
      skipDuplicates: true,
    });

    await this.prismaService.productionCompany.createMany({
      data: productionCompanies,
      skipDuplicates: true,
    });

    const createdShow = await this.prismaService.show.create({
      data: {
        ...show,
        statusId: statusId,
        seasons: {
          create: seasons,
        },
      },
    });

    await this.prismaService.show.update({
      where: { id: createdShow.id },
      data: {
        genres: {
          connect: genres.map(pick('externalId')),
        },
        keywords: {
          connect: keywords.map(pick('externalId')),
        },
        productionCompanies: {
          connect: productionCompanies.map(pick('externalId')),
        },
      },
    });

    return createdShow;
  }

  private getShowIdByExternalId(externalId: number): Promise<number> {
    return this.prismaService.show
      .findUnique({
        where: { externalId },
        select: { id: true },
      })
      .then(prop('id'));
  }

  private async createShowEpisodes(showExternalId: number) {
    const showId = await this.getShowIdByExternalId(showExternalId);
    const seasons = await this.prismaService.season.findMany({
      where: { showId },
      select: { id: true, number: true, showId: true },
    });

    await Promise.all(
      seasons.map(async ({ id, number }) => {
        const episodes = await this.tmdbShowService
          .getSeasonEpisodes(showExternalId, number)
          .then(map(assoc('seasonId', id)));

        await this.prismaService.episode.createMany({
          data: episodes,
          skipDuplicates: true,
        });
      }),
    );
  }
}
