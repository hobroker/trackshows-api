import { Inject, Injectable } from '@nestjs/common';
import { always, compose, evolve, indexBy, prop } from 'rambda';
import { filter, when } from 'rambda/immutable';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '../../http';
import { episodeFacade, showFacade } from '../facades';
import { RawEpisodeInterface, RawPartialShowInterface } from '../interfaces';
import { TmdbPersonService } from './tmdb-person.service';
import { tmdbConfig } from '../tmdb.config';
import { partialShowFacade } from '../facades/show.facade';
import { PrismaService } from '../../prisma';

type IdMapType = { [x: string]: object };

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

  async getTrending({ page = 1 }: { page?: number } = {}): Promise<
    RawPartialShowInterface[]
  > {
    const {
      data: { results },
    } = await this.httpService.get(`/trending/tv/week`, {
      params: {
        page,
      },
    });

    return results.map(partialShowFacade);
  }

  private _genreMap: IdMapType;

  async getGenresMap() {
    if (!this._genreMap) {
      this._genreMap = await this.prismaService.genre
        .findMany()
        .then(indexBy(prop('externalId')));
    }

    return this._genreMap;
  }

  async getDetails(tvId: number) {
    const { skipSpecials } = this.config;
    const data = await this.httpService
      .get(`/tv/${tvId}`, {
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
