import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '../../http';
import { keywordFacade } from '../facades';
import { RawKeywordInterface } from '../interfaces';

@Injectable()
export class TmdbPersonService {
  @Inject(HttpService)
  private httpService: HttpService;

  async findMany(seriesId: number): Promise<RawKeywordInterface[]> {
    const { data } = await this.httpService.get(`/tv/${seriesId}/keywords`);

    return data.results.map(keywordFacade);
  }
}
