import { Inject, Injectable } from '@nestjs/common';
import { assoc, map, prop } from 'rambda';
import { serial } from '../../../util/promise';
import { PrismaService } from '../../prisma';
import { TmdbShowService } from '../../tmdb';

@Injectable()
export class SyncShowService {
  @Inject(TmdbShowService)
  private tmdbShowService: TmdbShowService;

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
    await this.createCredits(showExternalId);

    return show;
  }

  async deleteAll() {
    return this.prismaService.show.deleteMany();
  }

  private async createShow(externalId: number) {
    const { status, seasons, genres, keywords, productionCompanies, ...show } =
      await this.tmdbShowService.getDetails(externalId);
    const connectMany = (array) =>
      array.map(({ externalId, ...rest }) => ({
        where: {
          externalId,
        },
        create: {
          externalId,
          ...rest,
        },
      }));

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
        seasons: {
          create: seasons,
        },
        genres: {
          connectOrCreate: connectMany(genres),
        },
        keywords: {
          connectOrCreate: connectMany(keywords),
        },
        productionCompanies: {
          connectOrCreate: connectMany(productionCompanies),
        },
      },
    });
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

  private async createCredits(showExternalId: number) {
    const showId = await this.getShowIdByExternalId(showExternalId);
    const { cast, crew } = await this.tmdbShowService.getCredits(
      showExternalId,
    );
    const createMap = (data) =>
      data.reduce(
        (acc, item) => ({
          ...acc,
          [item.externalId]: item.id,
        }),
        {},
      );

    const gendersMap = await this.prismaService.gender
      .findMany({ select: { id: true, externalId: true } })
      .then(createMap);
    const personsToInsert = [...crew, ...cast].map(
      ({ person: { externalGenderId, ...person } }) => ({
        ...person,
        genderId: gendersMap[externalGenderId],
      }),
    );
    await this.prismaService.person.createMany({
      data: personsToInsert,
      skipDuplicates: true,
    });
    const personIds = [...crew, ...cast].map(
      ({ person: { externalId } }) => externalId,
    );
    const personsMap = await this.prismaService.person
      .findMany({
        where: {
          externalId: { in: personIds },
        },
        select: { id: true, externalId: true },
      })
      .then(createMap);

    await serial([
      () =>
        this.prismaService.cast.createMany({
          data: cast.map(({ person, ...rest }) => ({
            ...rest,
            showId,
            personId: personsMap[person.externalId],
          })),
          skipDuplicates: true,
        }),
      () =>
        this.prismaService.crew.createMany({
          data: crew.map(({ person, ...rest }) => ({
            ...rest,
            showId,
            personId: personsMap[person.externalId],
          })),
          skipDuplicates: true,
        }),
    ]);
  }
}
