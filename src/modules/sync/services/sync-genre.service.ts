import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { TmdbGenreService } from '../../tmdb';

@Injectable()
export class SyncGenreService {
  @Inject(TmdbGenreService)
  private tmdbGenreService: TmdbGenreService;

  @Inject(PrismaService)
  private prismaService: PrismaService;

  async sync() {
    const genres = await this.tmdbGenreService.list();

    return this.prismaService.genre.createMany({
      data: genres,
      skipDuplicates: true,
    });
  }
}
