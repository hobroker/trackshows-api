import { Inject, Injectable } from '@nestjs/common';
import { always, compose, evolve, prop } from 'rambda';
import { filter, when } from 'rambda/immutable';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '../../http';
import { castFacade, episodeFacade, showFacade, crewFacade } from '../facades';
import {
  RawCastInterface,
  RawCrewInterface,
  RawEpisodeInterface,
} from '../interfaces';
import { TmdbPersonService } from './tmdb-person.service';
import { serial } from '../../../util/promise';
import { tmdbConfig } from '../tmdb.config';

@Injectable()
export class TmdbShowService {
  @Inject(tmdbConfig.KEY)
  private config: ConfigType<typeof tmdbConfig>;

  @Inject(HttpService)
  private httpService: HttpService;

  @Inject(TmdbPersonService)
  private tmdbPersonService: TmdbPersonService;

  async getDetails(tvId: number) {
    const { skipSpecials } = this.config;
    const data = await this.httpService
      .get(`/tv/${tvId}`, {
        params: {
          append_to_response: 'keywords',
        },
      })
      .then(prop('data'))
      .then(
        when(
          always(skipSpecials),
          evolve({
            seasons: filter(compose(Boolean, prop('season_number'))),
          }),
        ),
      );

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
      data.crew,
      crewFacade,
    );
    const cast = await this.linkPersonToCredits<RawCastInterface>(
      data.cast,
      castFacade,
    );

    return { cast, crew };
  }

  private async linkPersonToCredits<T>(credits, creditFacade): Promise<T[]> {
    return serial<T>(
      credits.map((credit) => async () => {
        const { id } = credit;
        const person = await this.tmdbPersonService.getDetails(id);

        return creditFacade({
          ...credit,
          person,
        });
      }),
      10,
    );
  }
}
