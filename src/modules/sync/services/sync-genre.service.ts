import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { TmdbGenreService } from '../../tmdb';

@Injectable()
export class SyncGenreService {
  constructor(
    private prismaService: PrismaService,
    private tmdbGenreService: TmdbGenreService,
  ) {}

  async syncAllGenres() {
    const genres = await this.tmdbGenreService.list();

    return this.prismaService.genre.createMany({
      data: genres,
      skipDuplicates: true,
    });
  }
}
