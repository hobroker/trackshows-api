import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '../../http';
import { episodeFacade, showFacade } from '../facades';
import { RawEpisodeInterface } from '../interfaces';

@Injectable()
export class TmdbShowService {
  @Inject(HttpService)
  private httpService: HttpService;

  async getDetails(tvId: number) {
    const { data } = await this.httpService.get(`/tv/${tvId}`, {
      params: {
        append_to_response: 'keywords',
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

  async getAllEpisodes(
    externalShowId: number,
    seasonNumbers: number[],
  ): Promise<RawEpisodeInterface[][]> {
    return Promise.all(
      seasonNumbers.map((seasonNumber) =>
        this.getSeasonEpisodes(externalShowId, seasonNumber),
      ),
    );
  }
}
