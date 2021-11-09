import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '../../http';
import { episodeFacade, showFacade } from '../facades';
import { RawEpisodeInterface } from '../interfaces';
import { TmdbPersonService } from './tmdb-person.service';

@Injectable()
export class TmdbShowService {
  @Inject(HttpService)
  private httpService: HttpService;

  @Inject(TmdbPersonService)
  private tmdbPersonService: TmdbPersonService;

  async getDetails(tvId: number) {
    const { data } = await this.httpService.get(`/tv/${tvId}`, {
      params: {
        append_to_response: 'keywords,credits',
      },
    });

    return showFacade(data);
  }

  async getSeasonEpisodes(
    externalId: number,
    seasonNumber: number,
  ): Promise<RawEpisodeInterface[]> {
    const { data } = await this.httpService.get(
      `/tv/${externalId}/season/${seasonNumber}`,
    );

    return data.episodes.map(episodeFacade);
  }
}
