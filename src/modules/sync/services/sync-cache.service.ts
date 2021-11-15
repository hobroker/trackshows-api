import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { TmdbShowService } from '../../tmdb';
import { mapExternalIdToId, mapPropToProp } from '../sync.util';

type IdMapType = { [x: string]: number };

@Injectable()
export class SyncCacheService {
  @Inject(TmdbShowService)
  private tmdbShowService: TmdbShowService;

  @Inject(PrismaService)
  private prismaService: PrismaService;

  private _genreMap: IdMapType = {};
  private _genderMap: IdMapType = {};
  private _statusMap: IdMapType = {};
  private _keywordMap: IdMapType = {};
  private _productionCompanyMap: IdMapType = {};
  private _personMap: IdMapType = {};

  private _personsMap = {};

  get genderMap() {
    return this._genderMap;
  }

  get personMap() {
    return this._personMap;
  }

  get genreMap() {
    return this._genreMap;
  }

  get statusMap() {
    return this._statusMap;
  }

  async cacheAllGenders() {
    this._genderMap = await this.prismaService.gender
      .findMany({ select: { id: true, externalId: true } })
      .then(mapExternalIdToId);
  }

  async cacheAllGenres() {
    this._genreMap = await this.prismaService.genre
      .findMany({ select: { id: true, externalId: true } })
      .then(mapExternalIdToId);
  }

  async cacheStatuses() {
    this._statusMap = await this.prismaService.status
      .findMany({ select: { id: true, name: true } })
      .then(mapPropToProp('name', 'id'));
  }

  async cacheKeywords(externalIds: number[]) {
    this._keywordMap = await this.prismaService.keyword
      .findMany({
        where: { externalId: { in: externalIds } },
        select: { id: true, externalId: true },
      })
      .then(mapExternalIdToId);
  }

  async cacheProductionCompanies(externalIds: number[]) {
    this._productionCompanyMap = await this.prismaService.productionCompany
      .findMany({
        where: { externalId: { in: externalIds } },
        select: { id: true, externalId: true },
      })
      .then(mapExternalIdToId);
  }

  async cachePersons(externalIds: number[]) {
    this._personMap = await this.prismaService.person
      .findMany({
        where: { externalId: { in: externalIds } },
        select: { id: true, externalId: true },
      })
      .then(mapExternalIdToId);
  }

  setPersonMapItem(externalId: number, id: number) {
    this._personMap[externalId] = id;
  }

  async getStatusIdByName(name: string) {
    if (this._statusMap[name]) {
      return this._statusMap[name];
    }

    await this.prismaService.status.createMany({
      data: [{ name }],
      skipDuplicates: true,
    });

    const { id } = await this.prismaService.status.findUnique({
      where: { name },
    });

    this._statusMap[name] = id;

    return this._statusMap[name];
  }

  mergePersonsMap(_personsMap) {
    this._personsMap = { ...this._personsMap, ..._personsMap };

    return this._personsMap;
  }
}
