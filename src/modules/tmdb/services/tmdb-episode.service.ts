import { Inject, Injectable } from '@nestjs/common';
import { always, flatten, map } from 'ramda';
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
    const {
      details: { seasons },
    } = await this.tmdbShowService.getShow(showId);
    const data: Episode[][] = await Promise.all(
      seasons.map(async ({ number }) =>
        this.httpService
          .get(`/tv/${showId}/season/${number}`)
          .then(({ data }) => data.episodes)
          .then(map(episodeFacade)),
      ),
    );

    return flatten(data);
  }

  @Memoize({ hashFunction: true })
  async getDetails(
    showId: number,
    seasonNumber: number,
    episodeNumber: number,
  ): Promise<Episode> {
    return this.httpService
      .get(`/tv/${showId}/season/${seasonNumber}/episode/${episodeNumber}`)
      .then(({ data }) => episodeFacade({ ...data, showId }))
      .catch(always(null));
  }
}
