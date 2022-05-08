import { Injectable } from '@nestjs/common';
import { HttpService } from '../../http';
import { keywordFacade } from '../facades';
import { KeywordInterface } from '../interfaces';

@Injectable()
export class TmdbPersonService {
  constructor(private httpService: HttpService) {}

  async findMany(seriesId: number): Promise<KeywordInterface[]> {
    const { data } = await this.httpService.get(`/tv/${seriesId}/keywords`);

    return data.results.map(keywordFacade);
  }
}
