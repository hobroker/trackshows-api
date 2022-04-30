import { Inject, Injectable } from '@nestjs/common';
import { always, compose, evolve, prop, filter, propEq, when } from 'ramda';
import { ConfigType } from '@nestjs/config';
import { Memoize } from 'typescript-memoize';
import { HttpService } from '../../http';
import { episodeFacade, partialShowFacade, fullShowFacade } from '../facades';
import { PartialShowInterface } from '../interfaces';
import { tmdbConfig } from '../tmdb.config';
import { indexByAndMap } from '../../../util/fp/indexByAndMap';
import { PartialShow } from '../../show';
import { Episode } from '../../show/entities/episode';

type PartialShowWithGenreIds = PartialShow & { genreIds: number[] };

@Injectable()
export class TmdbShowService {
  constructor(
    @Inject(tmdbConfig.KEY)
    private config: ConfigType<typeof tmdbConfig>,

    private readonly httpService: HttpService,
  ) {
    this.discoverByGenreId = this.discoverByGenreId.bind(this);
    this.whereNotExcluded = this.whereNotExcluded.bind(this);
  }

  async discoverByGenres(
    genreIds: number[] = [],
    { countPerGenre = 6 } = {},
  ): Promise<PartialShowWithGenreIds[]> {
    const data = await Promise.all(genreIds.map(this.discoverByGenreId));

    return data.reduce((acc, curr) => {
      let i = 0;

      curr.forEach((item) => {
        if (
          i >= countPerGenre ||
          acc.find(propEq('externalId', item.externalId))
        ) {
          return;
        }
        acc.push(item);
        i++;
      });

      return acc;
    }, []);
  }

  @Memoize({ hashFunction: true })
  private async discoverByGenreId(
    genreId: number,
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

    return results.map(partialShowFacade).filter(this.whereNotExcluded);
  }

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

  @Memoize({ hashFunction: true })
  async getShow(externalId: number) {
    const data = await this.httpService
      .get(`/tv/${externalId}`, {
        params: {
          append_to_response: 'keywords',
        },
      })
      .then(prop('data'))
      .then(
        when(
          always(this.config.skipSpecials),
          evolve({
            seasons: filter(compose(Boolean, prop('season_number'))),
          }),
        ),
      );

    return fullShowFacade(data);
  }

  async getEpisodesMap(
    externalId: number,
    seasonNumbers: number[],
  ): Promise<Record<string, Episode[]>> {
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

  private whereNotExcluded(show: PartialShowInterface) {
    const { skipShowIds } = this.config;

    return !skipShowIds.includes(show.externalId);
  }
}
