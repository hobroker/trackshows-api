import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '../../http';
import { RawPersonInterface } from '../interfaces';

const personFacade = (data): RawPersonInterface => ({
  name: data.name,
  description: data.biography,
  image: data.profile_path,
  birthday: new Date(data.birthday),
  deathday: data.deathday && new Date(data.deathday),
  externalId: data.id,
  genderId: data.gender,
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
