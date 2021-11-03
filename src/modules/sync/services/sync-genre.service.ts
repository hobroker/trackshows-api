import { Inject, Injectable } from '@nestjs/common';
import { applySpec, map, prop } from 'ramda';
import { Genre } from '../../genre';
import { PrismaService } from '../../prisma';
import { TmdbGenreService } from '../../tmdb';

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

  async sync() {
    const genres = await this.tmdbGenreService.list().then(map(genreFacade));

    return this.prismaService.genre.createMany({
      data: genres,
      skipDuplicates: true,
    });
  }
}
