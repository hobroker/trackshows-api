import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { HttpService } from '../../http';
import { GenreInterface } from '../interfaces';
import { genreFacade } from '../facades';

@Injectable()
export class TmdbGenreService {
  @Inject(HttpService)
  private httpService: HttpService;

  @Inject(PrismaService)
  private prismaService: PrismaService;

  async list(): Promise<GenreInterface[]> {
    const { data } = await this.httpService.get('/genre/tv/list');

    return data.genres.map(genreFacade);
  }
}
