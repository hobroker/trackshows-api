import { Inject, Injectable } from '@nestjs/common';
import { assoc, indexBy, map, prop } from 'rambda';
import { PrismaService } from '../../prisma';
import { TmdbShowService } from '../../tmdb';

@Injectable()
export class SyncShowService {
  @Inject(TmdbShowService)
  private tmdbShowService: TmdbShowService;

  @Inject(PrismaService)
  private prismaService: PrismaService;

  async syncOne(externalId: number) {
    const record = await this.prismaService.show.findUnique({
      where: { externalId },
    });

    if (record) {
      return null;
    }

    const show = await this.createShow(externalId);
    await this.createShowEpisodes(show.id, externalId);
  }

  async deleteAll() {
    return this.prismaService.show.deleteMany({});
  }

  private async createShow(externalId: number) {
    const { status, seasons, genres, keywords, ...show } =
      await this.tmdbShowService.getDetails(externalId);

    return this.prismaService.show.create({
      data: {
        ...show,
        status: {
          connectOrCreate: {
            where: {
              name: status.name,
            },
            create: {
              name: status.name,
            },
          },
        },
        genres: {
          create: genres.map(({ externalId, ...rest }) => ({
            genre: {
              connectOrCreate: {
                where: {
                  externalId,
                },
                create: {
                  externalId,
                  ...rest,
                },
              },
            },
          })),
        },
        keywords: {
          create: keywords.map(({ externalId, ...rest }) => ({
            keyword: {
              connectOrCreate: {
                where: {
                  externalId,
                },
                create: {
                  externalId,
                  ...rest,
                },
              },
            },
          })),
        },
        seasons: {
          create: seasons,
        },
      },
    });
  }

  private async createShowEpisodes(showId: number, showExternalId: number) {
    const seasonIdsMapByNumbers = await this.prismaService.season
      .findMany({
        where: { showId },
        select: { id: true, number: true },
      })
      .then(indexBy(prop('number')))
      .then(map(prop('id')));

    await Promise.all(
      Object.entries(seasonIdsMapByNumbers).map(async ([key, seasonId]) => {
        const seasonNumber = parseInt(key, 10);
        const episodes = await this.tmdbShowService
          .getSeasonEpisodes(showExternalId, seasonNumber)
          .then(map(assoc('seasonId', seasonId)));

        await this.prismaService.episode.createMany({
          data: episodes,
        });
      }),
    );
  }
}
