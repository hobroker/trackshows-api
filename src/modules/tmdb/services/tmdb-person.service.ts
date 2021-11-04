import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '../../http';
import { personFacade } from '../facades';
import { RawPersonInterface } from '../interfaces';

@Injectable()
export class TmdbPersonService {
  @Inject(HttpService)
  private httpService: HttpService;

  async getDetails(personId: number): Promise<RawPersonInterface> {
    const { data } = await this.httpService.get(`/person/${personId}`);

    return personFacade(data);
  }
}
