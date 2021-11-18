import { Inject, Injectable } from '@nestjs/common';
import { always, compose, evolve, prop } from 'rambda';
import { filter, when } from 'rambda/immutable';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '../../http';
import { episodeFacade, showDetailsFacade } from '../facades';
import { EpisodeInterface, PartialShowInterface } from '../interfaces';
import { TmdbPersonService } from './tmdb-person.service';
import { tmdbConfig } from '../tmdb.config';
import { partialShowFacade } from '../facades/show.facade';
import { PrismaService } from '../../prisma';

@Injectable()
export class TmdbShowService {
  @Inject(tmdbConfig.KEY)
  private config: ConfigType<typeof tmdbConfig>;

  @Inject(HttpService)
  private httpService: HttpService;

  @Inject(TmdbPersonService)
  private tmdbPersonService: TmdbPersonService;

  @Inject(PrismaService)
  private prismaService: PrismaService;

  async getTrending({
    page = 1,
    period = 'week',
  }: { page?: number; period?: 'day' | 'week' } = {}): Promise<
    PartialShowInterface[]
  > {
    const {
      data: { results },
    } = await this.httpService.get(`/trending/tv/${period}`, {
      params: {
        page,
      },
    });

    return results.map(partialShowFacade);
  }

  async getDetails(externalId: number) {
    const { skipSpecials } = this.config;
    const data = await this.httpService
      .get(`/tv/${externalId}`, {
        params: {
          append_to_response: 'keywords,credits',
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

    return showDetailsFacade(data);
  }

  async getSeasonEpisodes(
    externalId: number,
    seasonNumber: number,
  ): Promise<EpisodeInterface[]> {
    const { data } = await this.httpService.get(
      `/tv/${externalId}/season/${seasonNumber}`,
    );

    return data.episodes.map(episodeFacade);
  }
}
