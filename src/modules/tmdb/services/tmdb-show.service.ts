import { Inject, Injectable } from '@nestjs/common';
import { always, compose, evolve, identity, prop } from 'rambda';
import { filter, when } from 'rambda/immutable';
import { ConfigType } from '@nestjs/config';
import { Memoize } from 'typescript-memoize';
import { HttpService } from '../../http';
import { episodeFacade, showDetailsFacade } from '../facades';
import { EpisodeInterface, PartialShowInterface } from '../interfaces';
import { tmdbConfig } from '../tmdb.config';
import { partialShowFacade } from '../facades/show.facade';
import { indexByAndMap } from '../../../util/fp/indexByAndMap';
import { PartialShow } from '../../show';

interface WithPagination {
  page?: number;
}

type PartialShowWithGenreIds = PartialShow & { genreIds: number[] };

@Injectable()
export class TmdbShowService {
  constructor(
    @Inject(tmdbConfig.KEY)
    private config: ConfigType<typeof tmdbConfig>,

    private readonly httpService: HttpService,
  ) {}

  async discoverByGenres(
    genreIds: number[] = [],
  ): Promise<PartialShowWithGenreIds[]> {
    const data = await Promise.all(
      genreIds.map((genreId) => this.discoverByGenreId(genreId)),
    );

    return data.flatMap(identity);
  }

  @Memoize()
  private async discoverByGenreId(
    genreId: number,
    { maxResults = 20 } = {},
  ): Promise<PartialShowWithGenreIds[]> {
    const {
      data: { results },
    } = await this.httpService.get(`/discover/tv`, {
      params: {
        page: 1,
        with_genres: genreId,
        with_original_language: 'en',
      },
    });

    return results.slice(0, maxResults).map(partialShowFacade);
  }

  async getTrending({
    page = 1,
    period = 'week',
  }: WithPagination & { period?: 'day' | 'week' } = {}): Promise<
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
