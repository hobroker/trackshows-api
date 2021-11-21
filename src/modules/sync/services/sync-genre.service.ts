import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { TmdbGenreService } from '../../tmdb';
import { handleError } from '../../logger/util';

@Injectable()
export class SyncGenreService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private prismaService: PrismaService,
    private tmdbGenreService: TmdbGenreService,
  ) {}

  async syncAllGenres() {
    this.logger.log('Adding genres');

    const genres = await this.tmdbGenreService.list();

    return this.prismaService.genre
      .createMany({
        data: genres,
        skipDuplicates: true,
      })
      .catch(handleError(this.logger));
  }
}
