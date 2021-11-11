import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { TmdbShowService } from '../../tmdb';
import { mapExternalIdToId } from '../sync.util';

@Injectable()
export class SyncCacheService {
  @Inject(TmdbShowService)
  private tmdbShowService: TmdbShowService;

  @Inject(PrismaService)
  private prismaService: PrismaService;

  private gendersMap = {};

  private personsMap = {};

  private statusMap = {};

  async getGendersMap() {
    if (Object.values(this.gendersMap).length === 0) {
      this.gendersMap = await this.prismaService.gender
        .findMany({ select: { id: true, externalId: true } })
        .then(mapExternalIdToId);
    }

    return this.gendersMap;
  }

  getPersonsMap() {
    return this.personsMap;
  }

  async getStatusIdByName(name: string) {
    if (this.statusMap[name]) {
      return this.statusMap[name];
    }

    await this.prismaService.status.createMany({
      data: [{ name }],
      skipDuplicates: true,
    });

    const { id } = await this.prismaService.status.findUnique({
      where: { name },
    });

    this.statusMap[name] = id;

    return this.statusMap[name];
  }

  mergePersonsMap(personsMap) {
    this.personsMap = { ...this.personsMap, ...personsMap };

    return this.personsMap;
  }
}
