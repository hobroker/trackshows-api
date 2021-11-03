import { Inject, Injectable } from '@nestjs/common';
import { applySpec, prop } from 'ramda';
import { PrismaService } from '../../prisma';
import { HttpService } from '../../http';
import { RawGenreInterface } from '../interfaces/raw-genre.interface';

const genreFacade = applySpec<RawGenreInterface>({
  externalId: prop('id'),
  name: prop('name'),
});

@Injectable()
export class TmdbGenreService {
  @Inject(HttpService)
  private httpService: HttpService;

  @Inject(PrismaService)
  private prismaService: PrismaService;

  async list(): Promise<RawGenreInterface[]> {
    const { data } = await this.httpService.get('/genre/tv/list');

    return data.genres.map(genreFacade);
  }
}
