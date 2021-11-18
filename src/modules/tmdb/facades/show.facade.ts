import { applySpec, compose, prop } from 'rambda';
import { sanitize } from '../../../util/fp';
import { PartialShowInterface, ShowDetailsInterface } from '../interfaces';

export const partialShowFacade = applySpec<PartialShowInterface>({
  externalId: prop('id'),
  name: prop('name'),
  description: compose(sanitize, prop('overview')),
  wideImage: prop('poster_path'),
  tallImage: prop('poster_path'),
  externalGenresIds: prop('genre_ids'),
});

export const showFacade = applySpec<ShowDetailsInterface>({
  externalId: prop('id'),
  name: prop('name'),
  description: compose(sanitize, prop('overview')),
  wideImage: prop('poster_path'),
  tallImage: prop('poster_path'),
  isInProduction: prop('in_production'),
  status: prop('status'),
});
