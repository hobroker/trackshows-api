import { applySpec, compose, head, map, path, prop } from 'rambda';
import { RawShowInterface } from '../interfaces';
import { genreFacade } from './genre.facade';
import { keywordFacade } from './keyword.facade';
import { statusFacade } from './status.facade';
import { seasonFacade } from './season.facade';

export const showFacade = applySpec<RawShowInterface>({
  externalId: prop('id'),
  name: prop('name'),
  description: prop('overview'),
  wideImage: prop('poster_path'),
  tallImage: prop('poster_path'),
  episodeRuntime: compose(head, prop('episode_run_time')),
  isInProduction: prop('in_production'),
  status: statusFacade,
  genres: compose(map(genreFacade), prop('genres')),
  keywords: compose(map(keywordFacade), path(['keywords', 'results'])),
  seasons: ({ seasons, episodes }) =>
    seasons.map((season, idx) =>
      seasonFacade({
        ...season,
        episodes: episodes[idx],
      }),
    ),
});
