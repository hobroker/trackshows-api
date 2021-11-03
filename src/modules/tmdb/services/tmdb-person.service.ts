import { Inject, Injectable } from '@nestjs/common';
import { applySpec, compose, prop } from 'ramda';
import { toDate } from '../../../util/fp';
import { HttpService } from '../../http';
import { RawPersonInterface } from '../interfaces';

const personFacade = applySpec<RawPersonInterface>({
  name: prop('name'),
  description: prop('biography'),
  image: prop('profile_path'),
  birthday: compose(toDate, prop('birthday')),
  deathday: compose(toDate, prop('deathday')),
  externalId: prop('id'),
  genderId: prop('gender'),
});

@Injectable()
export class TmdbPersonService {
  @Inject(HttpService)
  private httpService: HttpService;

  async getDetails(personId: number): Promise<RawPersonInterface> {
    const { data } = await this.httpService.get(`/person/${personId}`);

    return personFacade(data);
  }
}
