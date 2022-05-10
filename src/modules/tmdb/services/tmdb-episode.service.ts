import { Inject, Injectable } from '@nestjs/common';
import { always, assoc, flatten, map, prop } from 'ramda';
import { ConfigType } from '@nestjs/config';
import { Memoize } from 'typescript-memoize';
import { HttpService } from '../../http';
import { episodeFacade } from '../facades';
import { tmdbConfig } from '../tmdb.config';
import { Episode } from '../../show/entities/episode';
import { TmdbShowService } from './tmdb-show.service';

@Injectable()
export class TmdbEpisodeService {
  constructor(
    @Inject(tmdbConfig.KEY)
    private config: ConfigType<typeof tmdbConfig>,

    private readonly httpService: HttpService,
    private readonly tmdbShowService: TmdbShowService,
  ) {}

  @Memoize({ hashFunction: true })
  async getAllEpisodes(showId: number): Promise<Episode[]> {
    const { seasons } = await this.tmdbShowService.getShow(showId);
    const data: Episode[][] = await Promise.all(
      seasons.map(async ({ number }) => this.getSeasonEpisodes(showId, number)),
    );

    return flatten(data);
  }

  @Memoize({ hashFunction: true })
  async getSeasonEpisodes(
    showId: number,
    seasonNumber: number,
  ): Promise<Episode[]> {
    return this.httpService
      .get(`/tv/${showId}/season/${seasonNumber}`)
      .then(({ data }) => data.episodes)
      .then(map(assoc('showId', showId)))
      .then(map(episodeFacade));
  }

  @Memoize({ hashFunction: true })
  async getDetails(
    showId: number,
    seasonNumber: number,
    episodeNumber: number,
  ): Promise<Episode> {
    return this.httpService
      .get(`/tv/${showId}/season/${seasonNumber}/episode/${episodeNumber}`)
      .then(prop('data'))
      .then(assoc('showId', showId))
      .then(episodeFacade)
      .catch(always(null));
  }
}
