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
import { indexByAndMap } from '../../../util/fp/indexByAndMap';

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

  async getEpisodesMap(
    externalId: number,
    seasonNumbers: number[],
  ): Promise<Record<string, EpisodeInterface[]>> {
    const data = await Promise.all(
      seasonNumbers.map(async (seasonNumber) => {
        const { data } = await this.httpService.get(
          `/tv/${externalId}/season/${seasonNumber}`,
        );

        return {
          seasonExternalId: data.id,
          episodes: data.episodes.map(episodeFacade),
        };
      }),
    );

    return indexByAndMap(prop('seasonExternalId'), prop('episodes'), data);
  }
}
