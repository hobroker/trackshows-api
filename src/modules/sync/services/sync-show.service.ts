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
    await this.createCredits(showExternalId);
  }

  async deleteAll() {
    return this.prismaService.show.deleteMany();
  }

  private async createShow(externalId: number) {
    const { status, seasons, genres, keywords, productionCompanies, ...show } =
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
          connectOrCreate: genres.map(({ externalId, ...rest }) => ({
            where: {
              externalId,
            },
            create: {
              externalId,
              ...rest,
            },
          })),
        },
        keywords: {
          connectOrCreate: keywords.map(({ externalId, ...rest }) => ({
            where: {
              externalId,
            },
            create: {
              externalId,
              ...rest,
            },
          })),
        },
        productionCompanies: {
          connectOrCreate: productionCompanies.map(
            ({ externalId, ...rest }) => ({
              where: {
                externalId,
              },
              create: {
                externalId,
                ...rest,
              },
            }),
          ),
        },
        seasons: {
          create: seasons,
        },
      },
    });
  }

  private getShowIdByExternalId(externalId: number) {
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

  private async createCredits(showExternalId: number) {
    const showId = await this.getShowIdByExternalId(showExternalId);
    const { cast, crew } = await this.tmdbShowService.getCredits(
      showExternalId,
    );

    await Promise.all(
      cast.map(({ person: { externalGenderId, ...person }, ...rest }) =>
        this.prismaService.cast.create({
          data: {
            ...rest,
            show: {
              connect: {
                id: showId,
              },
            },
            person: {
              connectOrCreate: {
                where: {
                  externalId: person.externalId,
                },
                create: {
                  ...person,
                  gender: {
                    connect: {
                      externalId: externalGenderId,
                    },
                  },
                },
              },
            },
          },
        }),
      ),
    );

    await Promise.all(
      crew.map(({ person: { externalGenderId, ...person }, ...rest }) =>
        this.prismaService.crew.create({
          data: {
            ...rest,
            show: {
              connect: {
                id: showId,
              },
            },
            person: {
              connectOrCreate: {
                where: {
                  externalId: person.externalId,
                },
                create: {
                  ...person,
                  gender: {
                    connect: {
                      externalId: externalGenderId,
                    },
                  },
                },
              },
            },
          },
        }),
      ),
    );
  }
}
