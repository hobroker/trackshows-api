import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '../../http';
import { castFacade, episodeFacade, showFacade, crewFacade } from '../facades';
import {
  RawCastInterface,
  RawCrewInterface,
  RawEpisodeInterface,
} from '../interfaces';
import { TmdbPersonService } from './tmdb-person.service';
import { serial } from '../../../util/promise';

@Injectable()
export class TmdbShowService {
  @Inject(HttpService)
  private httpService: HttpService;

  @Inject(TmdbPersonService)
  private tmdbPersonService: TmdbPersonService;

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

  async getCredits(externalId: any): Promise<{
    crew: RawCrewInterface[];
    cast: RawCastInterface[];
  }> {
    const { data } = await this.httpService.get(`/tv/${externalId}/credits`);

    const crew = await this.linkPersonToCredits<RawCrewInterface>(
      externalId,
      data.crew,
      crewFacade,
    );
    const cast = await this.linkPersonToCredits<RawCastInterface>(
      externalId,
      data.cast,
      castFacade,
    );

    return { cast, crew };
  }

  private async linkPersonToCredits<T>(
    showExternalId,
    credits,
    creditFacade,
  ): Promise<T[]> {
    const showId = showExternalId;

    return serial(
      credits.map((credit) => async () => {
        const { id } = credit;
        const person = await this.tmdbPersonService.getDetails(id);

        return creditFacade({
          ...credit,
          person,
          showId,
        });
      }),
      10,
    );
  }
}
