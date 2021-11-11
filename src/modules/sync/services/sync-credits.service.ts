import { Inject, Injectable } from '@nestjs/common';
import { prop } from 'rambda';
import { PrismaService } from '../../prisma';
import { TmdbShowService } from '../../tmdb';
import { SyncCacheService } from './sync-cache.service';
import { SyncPersonService } from './sync-person.service';

@Injectable()
export class SyncCreditsService {
  @Inject(TmdbShowService)
  private tmdbShowService: TmdbShowService;

  @Inject(PrismaService)
  private prismaService: PrismaService;

  @Inject(SyncPersonService)
  private syncPersonService: SyncPersonService;

  @Inject(SyncCacheService)
  private syncCacheService: SyncCacheService;

  async sync(showId: number, showExternalId: number) {
    const { cast, crew } = await this.tmdbShowService.getCredits(
      showExternalId,
    );
    const personsToInsert = [...cast, ...crew].map(prop('person'));

    await this.syncPersonService.insertPersons(personsToInsert);

    const personsMap = this.syncCacheService.getPersonsMap();

    await Promise.all([
      this.prismaService.cast.createMany({
        data: cast.map(({ person, ...rest }) => ({
          ...rest,
          showId,
          personId: personsMap[person.externalId],
        })),
        skipDuplicates: true,
      }),
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
