import { Inject, Injectable } from '@nestjs/common';
import { applySpec, map, prop } from 'ramda';
import { PrismaService } from '../../prisma';
import { Genre, TmdbGenreService } from '../../tmdb';

const genreFacade = applySpec<Genre>({
  externalId: prop('id'),
  name: prop('name'),
});

@Injectable()
export class SyncGenreService {
  @Inject(TmdbGenreService)
  private tmdbGenreService: TmdbGenreService;

  @Inject(PrismaService)
  private prismaService: PrismaService;

  async syncAll() {
    const genres = await this.tmdbGenreService.list().then(map(genreFacade));

    await this.prismaService.genre.createMany({
      data: genres,
      skipDuplicates: true,
    });
  }
}
