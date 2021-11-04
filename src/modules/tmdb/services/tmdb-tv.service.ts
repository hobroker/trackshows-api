import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '../../http';

@Injectable()
export class TmdbTvService {
  @Inject(HttpService)
  private httpService: HttpService;

  async getDetails(tvId: number) {
    const { data } = await this.httpService.get(`/tv/${tvId}`);

    return data;
  }
}
