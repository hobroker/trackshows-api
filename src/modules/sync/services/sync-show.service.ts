import { Inject, Injectable } from '@nestjs/common';
import {
  compose,
  map,
  prop,
  uniqWith,
  eqProps,
  flatten,
  converge,
  concat,
  dissoc,
} from 'rambda';
import { PrismaService } from '../../prisma';
import {
  RawEpisodeInterface,
  RawGenreInterface,
  RawKeywordInterface,
  RawPersonInterface,
  RawProductionCompanyInterface,
  RawShowInterface,
  RawStatusInterface,
  TmdbPersonService,
  TmdbShowService,
} from '../../tmdb';
import { SyncCacheService } from './sync-cache.service';
import { SyncCreditsService } from './sync-credits.service';
import { serial } from '../../../util/promise';
import { mapExternalIdToId } from '../sync.util';

const uniqWithProp =
  <T extends unknown>(prop) =>
  (array): T[] =>
    uniqWith<T, any>(eqProps(prop))(array);

@Injectable()
export class SyncShowService {
  @Inject(TmdbShowService)
  private tmdbShowService: TmdbShowService;
  @Inject(TmdbPersonService)
  private tmdbPersonService: TmdbPersonService;

  @Inject(SyncCacheService)
  private syncCacheService: SyncCacheService;

  @Inject(SyncCreditsService)
  private syncCreditsService: SyncCreditsService;

  @Inject(PrismaService)
  private prismaService: PrismaService;

  async syncMany(showExternalIds: number[]) {
    const shows = await serial<RawShowInterface>(
      showExternalIds.map(
        (id) => () => this.tmdbShowService.getFullDetails(id),
      ),
      10,
    );

    const statuses = compose(
      uniqWithProp<RawStatusInterface>('name'),
      map(prop('status')),
    )(shows);
    const genres = compose(
      uniqWithProp<RawGenreInterface>('externalId'),
      flatten,
      map(prop('genres')),
    )(shows);
    const keywords = compose(
      uniqWithProp<RawKeywordInterface>('externalId'),
      flatten,
      map(prop('keywords')),
    )(shows);
    const productionCompanies = compose(
      uniqWithProp<RawProductionCompanyInterface>('externalId'),
      flatten,
      map(prop('productionCompanies')),
    )(shows);
    const personIds: number[] = converge(concat, [
      compose(map(prop('externalId')), flatten, map(prop('crew'))),
      compose(map(prop('externalId')), flatten, map(prop('cast'))),
    ])(shows);

    await this.addStatuses(statuses);
    await this.addGenres(genres);
    await this.addKeywords(keywords);
    await this.addProductionCompanies(productionCompanies);
    await this.addPersons(personIds);

    await Promise.all(
      shows.map(async ({ cast, crew, ...show }) => {
        const episodesMap: {
          [x: string]: {
            episodes: RawEpisodeInterface[];
            id?: number;
          };
        } = show.seasons.reduce(
          (acc, { episodes, externalId }) => ({
            ...acc,
            [externalId]: { episodes },
          }),
          {},
        );
        const { id, seasons } = await this.addShow(show);
        const seasonsMap = mapExternalIdToId(seasons);
        Object.entries(episodesMap).forEach(([externalId]) => {
          episodesMap[externalId].id = seasonsMap[externalId];
        });

        const episodes: RawEpisodeInterface[] = flatten(
          Object.values(episodesMap).map(({ id, episodes }) =>
            episodes.map((episode) => ({
              seasonId: id,
              ...episode,
            })),
          ),
        );

        await this.prismaService.episode.createMany({
          data: episodes,
          skipDuplicates: true,
        });
        await this.syncCreditsService.sync(id, { cast, crew });
      }),
    );
  }

  async addShow(show: Omit<RawShowInterface, 'cast' | 'crew'>) {
    const { status, seasons, genres, keywords, productionCompanies, ...data } =
      show;

    return this.prismaService.show.create({
      data: {
        ...data,
        status: {
          connect: {
            name: status.name,
          },
        },
        genres: {
          connect: genres.map(({ externalId }) => ({ externalId })),
        },
        keywords: {
          connect: keywords.map(({ externalId }) => ({ externalId })),
        },
        productionCompanies: {
          connect: productionCompanies.map(({ externalId }) => ({
            externalId,
          })),
        },
        seasons: {
          createMany: {
            data: seasons.map(dissoc('episodes')),
          },
        },
      },
      select: {
        id: true,
        seasons: {
          select: {
            id: true,
            externalId: true,
          },
        },
      },
    });
  }

  async addStatuses(statuses: RawStatusInterface[]) {
    await this.prismaService.status.createMany({
      data: statuses,
      skipDuplicates: true,
    });
    await this.syncCacheService.cacheStatuses();
  }

  async addGenres(genres: RawGenreInterface[]) {
    await this.prismaService.genre.createMany({
      data: genres,
      skipDuplicates: true,
    });
    await this.syncCacheService.cacheAllGenres();
  }

  async addKeywords(items: RawKeywordInterface[]) {
    await this.prismaService.keyword.createMany({
      data: items,
      skipDuplicates: true,
    });
    await this.syncCacheService.cacheKeywords(items.map(prop('externalId')));
  }

  async addProductionCompanies(items: RawProductionCompanyInterface[]) {
    await this.prismaService.productionCompany.createMany({
      data: items,
      skipDuplicates: true,
    });
    await this.syncCacheService.cacheProductionCompanies(
      items.map(prop('externalId')),
    );
  }

  async addPersons(personExternalIds: number[]) {
    await this.syncCacheService.cacheAllGenders();
    await this.syncCacheService.cachePersons(personExternalIds);

    const { genderMap, personMap } = this.syncCacheService;
    const personExternalIdsToFetch = personExternalIds.filter(
      (value, idx, self) => !personMap[value] && self.indexOf(value) === idx,
    );

    const rawPersons: RawPersonInterface[] = await Promise.all(
      personExternalIdsToFetch.map(async (externalId) =>
        this.tmdbPersonService.getDetails(externalId),
      ),
    );

    await this.prismaService.person.createMany({
      data: rawPersons.map(({ externalGenderId, ...person }) => ({
        ...person,
        genderId: genderMap[externalGenderId],
      })),
      skipDuplicates: true,
    });
    await this.syncCacheService.cachePersons(personExternalIdsToFetch);
  }
}
