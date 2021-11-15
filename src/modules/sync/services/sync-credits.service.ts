import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import {
  RawCastInterface,
  RawCrewInterface,
  TmdbShowService,
} from '../../tmdb';
import { SyncCacheService } from './sync-cache.service';

@Injectable()
export class SyncCreditsService {
  @Inject(TmdbShowService)
  private tmdbShowService: TmdbShowService;

  @Inject(PrismaService)
  private prismaService: PrismaService;

  @Inject(SyncCacheService)
  private syncCacheService: SyncCacheService;

  async sync(
    showId: number,
    { cast, crew }: { crew: RawCrewInterface[]; cast: RawCastInterface[] },
  ) {
    const { personMap } = this.syncCacheService;

    const crewToInsert = crew.map(({ externalId, ...item }) => ({
      ...item,
      showId,
      personId: personMap[externalId],
    }));

    const castToInsert = cast.map(({ externalId, ...item }) => ({
      ...item,
      showId,
      personId: personMap[externalId],
    }));

    await Promise.all([
      this.prismaService.cast.createMany({
        data: castToInsert,
        skipDuplicates: true,
      }),
      this.prismaService.crew.createMany({
        data: crewToInsert,
        skipDuplicates: true,
      }),
    ]);
  }
}
