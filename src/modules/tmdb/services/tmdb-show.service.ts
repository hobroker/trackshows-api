import { Inject, Injectable } from '@nestjs/common';
import { prop } from 'rambda';
import { HttpService } from '../../http';
import { episodeFacade, showFacade } from '../facades';

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

    const show = showFacade(data);
    const seasonNumbers = show.seasons.map(prop('number'));
    const episodes = await this.getAllEpisodes(tvId, seasonNumbers);

    show.seasons = show.seasons.map((season, idx) => ({
      ...season,
      episodes: episodes[idx],
    }));

    return show;
  }

  private async getSeasonEpisodes(tvId: number, seasonNumber: number) {
    const { data } = await this.httpService.get(
      `/tv/${tvId}/season/${seasonNumber}`,
    );

    return data.episodes.map(episodeFacade);
  }

  private async getAllEpisodes(tvId: number, seasonNumbers: number[]) {
    return Promise.all(
      seasonNumbers.map((seasonNumber) =>
        this.getSeasonEpisodes(tvId, seasonNumber),
      ),
    );
  }
}
