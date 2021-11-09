import { applySpec, compose, filter, head, map, path, prop } from 'rambda';
import { RawShowInterface } from '../interfaces';
import { genreFacade } from './genre.facade';
import { keywordFacade } from './keyword.facade';
import { statusFacade } from './status.facade';
import { seasonFacade } from './season.facade';
import { productionCompanyFacade } from './production-company.facade';
import { castFacade } from './cast.facade';
import { crewFacade } from './crew.facade';

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
  seasons: compose(map(seasonFacade), prop('seasons')),
  cast: compose(map(castFacade), path(['credits', 'cast'])),
  crew: compose(map(crewFacade), path(['credits', 'crew'])),
  productionCompanies: compose(
    map(productionCompanyFacade),
    filter(compose(Boolean, prop('logo_path'))),
    prop('production_companies'),
  ),
});
