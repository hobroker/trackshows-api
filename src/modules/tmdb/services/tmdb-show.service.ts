import { Inject, Injectable } from '@nestjs/common';
import {
  always,
  compose,
  evolve,
  filter,
  prop,
  propEq,
  splitEvery,
  when,
} from 'ramda';
import { ConfigType } from '@nestjs/config';
import { Memoize } from 'typescript-memoize';
import { HttpService } from '../../http';
import { fullShowFacade, partialShowFacade } from '../facades';
import { PartialShowInterface } from '../interfaces';
import { tmdbConfig } from '../tmdb.config';
import { FullShow, PartialShow } from '../../show';
import { serialEvery } from '../../../util/promise';

@Injectable()
export class TmdbShowService {
  constructor(
    @Inject(tmdbConfig.KEY)
    private config: ConfigType<typeof tmdbConfig>,

    private readonly httpService: HttpService,
  ) {
    this.discoverByGenreId = this.discoverByGenreId.bind(this);
    this.whereNotExcluded = this.whereNotExcluded.bind(this);
    this.getShow = this.getShow.bind(this);
  }

  async discoverByGenres(
    genreIds: number[] = [],
    { countPerGenre = 6 } = {},
  ): Promise<PartialShow[]> {
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
  private async discoverByGenreId(genreId: number): Promise<PartialShow[]> {
    const {
      data: { results },
    } = await this.httpService.get(`/discover/tv`, {
      params: {
        page: 1,
        with_genres: genreId,
        with_original_language: 'en',
      },
    });

    return this.withPartialShowFacade(results);
  }

  @Memoize({ hashFunction: true })
  async getRecommendations(showId: number): Promise<PartialShow[]> {
    const {
      data: { results },
    } = await this.httpService.get(`/tv/${showId}/recommendations`);

    return this.withPartialShowFacade(results);
  }

  @Memoize({ hashFunction: true })
  async getShow(externalId: number) {
    const data = await this.httpService
      .get(`/tv/${externalId}`)
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

  @Memoize({ hashFunction: true })
  async search(query: string): Promise<PartialShow[]> {
    const {
      data: { results },
    } = await this.httpService.get(`/search/tv/`, {
      params: { query },
    });

    return this.withPartialShowFacade(results).filter(prop('wideImage'));
  }

  @Memoize({ hashFunction: true })
  getShows(externalIds: number[]): Promise<FullShow[]> {
    return serialEvery(splitEvery(10, externalIds), this.getShow);
  }

  private whereNotExcluded(show: PartialShowInterface) {
    const { skipShowIds } = this.config;

    return !skipShowIds.includes(show.externalId);
  }

  private withPartialShowFacade(data) {
    return data.map(partialShowFacade).filter(this.whereNotExcluded);
  }
}
