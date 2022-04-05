import { applySpec, compose, head, map, path, prop } from 'rambda';
import { sanitize } from '../../../util/fp';
import { PartialShowInterface, ShowDetailsInterface } from '../interfaces';
import { keywordFacade } from './keyword.facade';
import { seasonFacade } from './season.facade';
import { statusFacade } from './status.facade';

export const partialShowFacade = applySpec<PartialShowInterface>({
  externalId: prop('id'),
  name: prop('name'),
  description: compose(sanitize, prop('overview')),
  wideImage: prop('backdrop_path'),
  tallImage: prop('poster_path'),
  genreIds: prop('genre_ids'),
});

export const showDetailsFacade = applySpec<ShowDetailsInterface>({
  externalId: prop('id'),
  episodeRuntime: compose(head, prop('episode_run_time')),
  isInProduction: prop('in_production'),
  status: statusFacade,
  keywords: compose(map(keywordFacade), path(['keywords', 'results'])),
  seasons: compose(map(seasonFacade), prop('seasons')),
});
