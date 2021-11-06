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

  async deleteAll() {
    return this.prismaService.show.deleteMany({});
  }
}
