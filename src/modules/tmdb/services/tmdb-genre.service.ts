import { Injectable } from '@nestjs/common';
import { Memoize } from 'typescript-memoize';
import { HttpService } from '../../http';
import { Genre } from '../../show';
import { genreFacade } from '../facades';

@Injectable()
export class TmdbGenreService {
  constructor(private httpService: HttpService) {}

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
