import { Inject, Injectable } from '@nestjs/common';
import { Memoize } from 'typescript-memoize';
import { PrismaService } from '../../prisma';
import { HttpService } from '../../http';
import { genreFacade } from '../facades';
import { Genre } from '../../show';

@Injectable()
export class TmdbGenreService {
  @Inject(HttpService)
  private httpService: HttpService;

  @Inject(PrismaService)
  private prismaService: PrismaService;

  @Memoize()
  async list(): Promise<Genre[]> {
    const { data } = await this.httpService.get('/genre/tv/list');

    return data.genres.map(genreFacade);
  }

  async findByExternalIds(externalIds: number[]): Promise<Genre[]> {
    return this.list().then((genres) =>
      genres.filter(({ externalId }) => externalIds.includes(externalId)),
    );
  }
}
