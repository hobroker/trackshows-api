import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { TmdbGenreService } from '../../tmdb';

@Injectable()
export class SyncShowService {
  constructor(
    private tmdbGenreService: TmdbGenreService,
    private prismaService: PrismaService,
  ) {}

  async syncAllGenres() {
    const genres = await this.tmdbGenreService.list();

    await this.prismaService.genre.createMany({
      data: genres,
      skipDuplicates: true,
    });
  }
}
