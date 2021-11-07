import { Inject, Injectable } from '@nestjs/common';
import { assoc, prop } from 'rambda';
import { PrismaService } from '../../prisma';
import { TmdbShowService } from '../../tmdb';

@Injectable()
export class SyncShowService {
  @Inject(TmdbShowService)
  private tmdbShowService: TmdbShowService;

  @Inject(PrismaService)
  private prismaService: PrismaService;

  async syncOne(showExternalId: number) {
    const record = await this.prismaService.show.findUnique({
      where: { externalId: showExternalId },
    });

    if (!record) {
      await this.createShow(showExternalId);
    }

    await this.createShowEpisodes(showExternalId);
  }

  async deleteAll() {
    return this.prismaService.show.deleteMany();
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

  private async createShowEpisodes(showExternalId: number) {
    const showId = await this.prismaService.show
      .findUnique({
        where: { externalId: showExternalId },
        select: { id: true },
      })
      .then(prop('id'));
    const seasonIdsMapByNumbers = await this.prismaService.season.findMany({
      where: { showId },
      select: { id: true, number: true, showId: true },
    });

    await Promise.all(
      seasonIdsMapByNumbers.map(async ({ id, number }) => {
        const episodes = await this.tmdbShowService.getSeasonEpisodes(
          showExternalId,
          number,
        );

        await this.prismaService.episode.createMany({
          data: episodes.map(assoc('seasonId', id)),
          skipDuplicates: true,
        });
      }),
    );
  }
}
