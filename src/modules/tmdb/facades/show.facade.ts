import { applySpec, compose, filter, head, map, path, prop } from 'rambda';
import { sanitize } from '../../../util/fp';
import { PartialShowInterface, ShowDetailsInterface } from '../interfaces';
import { castFacade, crewFacade } from './credits.facade';
import { genreFacade } from './genre.facade';
import { keywordFacade } from './keyword.facade';
import { productionCompanyFacade } from './production-company.facade';
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
  genres: compose(map(genreFacade), prop('genres')),
  keywords: compose(map(keywordFacade), path(['keywords', 'results'])),
  seasons: compose(map(seasonFacade), prop('seasons')),
  productionCompanies: compose(
    map(productionCompanyFacade),
    prop('production_companies'),
  ),
  crew: compose(
    map(crewFacade),
    filter(compose(Boolean, prop('id'))),
    path(['credits', 'crew']),
  ),
  cast: compose(
    map(castFacade),
    filter(compose(Boolean, prop('id'))),
    path(['credits', 'cast']),
  ),
});
