import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { TmdbShowService } from '../../tmdb';

@Injectable()
export class SyncShowService {
  @Inject(TmdbShowService)
  private tmdbShowService: TmdbShowService;

  @Inject(PrismaService)
  private prismaService: PrismaService;

  async syncOne(showId: number) {
    const { status, seasons, genres, keywords, ...show } =
      await this.tmdbShowService.getDetails(showId);

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
          create: genres.map(({ externalId, name }) => ({
            genre: {
              connectOrCreate: {
                where: {
                  externalId,
                },
                create: {
                  externalId,
                  name,
                },
              },
            },
          })),
        },
        keywords: {
          create: keywords.map(({ externalId, name }) => ({
            keyword: {
              connectOrCreate: {
                where: {
                  externalId,
                },
                create: {
                  externalId,
                  name,
                },
              },
            },
          })),
        },
        seasons: {
          create: seasons.map(({ episodes, ...season }) => ({
            ...season,
            episodes: {
              create: episodes,
            },
          })),
        },
      },
    });
  }

  async deleteOne(showId: number) {
    return this.prismaService.show.delete({
      where: { externalId: showId },
    });
  }
}
