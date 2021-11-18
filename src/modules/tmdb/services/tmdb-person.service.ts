import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '../../http';
import { personFacade } from '../facades';
import { PersonInterface } from '../interfaces';

@Injectable()
export class TmdbPersonService {
  @Inject(HttpService)
  private httpService: HttpService;

  async getDetails(personId: number): Promise<PersonInterface> {
    const { data } = await this.httpService.get(`/person/${personId}`);

    return personFacade(data);
  }
}
