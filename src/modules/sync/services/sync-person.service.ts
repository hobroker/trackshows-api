import { Inject, Injectable } from '@nestjs/common';
import { prop } from 'rambda';
import { PrismaService } from '../../prisma';
import { RawPersonInterface } from '../../tmdb';
import { SyncCacheService } from './sync-cache.service';
import { mapExternalIdToId } from '../sync.util';

@Injectable()
export class SyncPersonService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  @Inject(SyncCacheService)
  private syncCacheService: SyncCacheService;

  async insertGenders(data) {
    return this.prismaService.gender.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async insertPersons(persons: RawPersonInterface[]) {
    const gendersMap = await this.syncCacheService.getGendersMap();
    const personsToInsert = persons.map(({ externalGenderId, ...person }) => ({
      ...person,
      genderId: gendersMap[externalGenderId],
    }));

    await this.prismaService.person.createMany({
      data: personsToInsert,
      skipDuplicates: true,
    });

    const personExternalIds = persons.map(prop('externalId'));

    const personsMapToMerge = await this.prismaService.person
      .findMany({
        where: {
          externalId: { in: personExternalIds },
        },
        select: { id: true, externalId: true },
      })
      .then(mapExternalIdToId);

    this.syncCacheService.mergePersonsMap(personsMapToMerge);
  }
}
