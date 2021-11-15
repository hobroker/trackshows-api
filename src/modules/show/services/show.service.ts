import { Inject, Injectable } from '@nestjs/common';
import { TmdbShowService } from '../../tmdb';
import { PrismaService } from '../../prisma';

@Injectable()
export class ShowService {
  @Inject(PrismaService)
  private prismaService: PrismaService;
  @Inject(TmdbShowService)
  private tmdbShowService: TmdbShowService;

  async listKeywords() {
    return this.prismaService.keyword.findMany({
      orderBy: [{ name: 'asc' }],
    });
  }

  async listTrending() {
    return this.tmdbShowService.getTrending();
  }
}
