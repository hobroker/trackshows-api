import { Inject, Injectable } from '@nestjs/common';
import { map, applySpec, prop } from 'ramda';
import { PrismaService } from '../../prisma';
import { HttpService } from '../../http';
import { Genre } from '../entities/genre';

const genreFacade = applySpec<Genre>({
  externalId: prop('id'),
  name: prop('name'),
});

@Injectable()
export class TmdbGenreService {
  @Inject(HttpService)
  private httpService: HttpService;

  @Inject(PrismaService)
  private prismaService: PrismaService;

  async list() {
    const { data } = await this.httpService.get('/genre/tv/list');
    const { genres } = data;

    return genres;
  }

  async syncList() {
    const genres = await this.list().then(map(genreFacade));

    await this.prismaService.genre.createMany({
      data: genres,
      skipDuplicates: true,
    });
  }
}
