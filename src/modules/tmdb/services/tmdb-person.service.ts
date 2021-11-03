import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '../../http';

@Injectable()
export class TmdbPersonService {
  @Inject(HttpService)
  private httpService: HttpService;

  async getDetails(personId: number) {
    const { data } = await this.httpService.get(`/person/${personId}`);

    return data;
  }
}
