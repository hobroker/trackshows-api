import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { TmdbShowService } from '../../tmdb';

@Injectable()
export class SyncShowService {
  @Inject(TmdbShowService)
  private tmdbShowService: TmdbShowService;

  @Inject(PrismaService)
  private prismaService: PrismaService;

  async sync(showId: number) {
    const show = await this.tmdbShowService.getDetails(showId);

    return show;
  }
}
