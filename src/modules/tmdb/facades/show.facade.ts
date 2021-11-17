import { applySpec, compose, prop } from 'rambda';
import { sanitize } from '../../../util/fp';
import { RawPartialShowInterface, RawShowInterface } from '../interfaces';

export const partialShowFacade = applySpec<RawPartialShowInterface>({
  externalId: prop('id'),
  name: prop('name'),
  description: compose(sanitize, prop('overview')),
  wideImage: prop('poster_path'),
  tallImage: prop('poster_path'),
  externalGenresIds: prop('genre_ids'),
});

export const showFacade = applySpec<RawShowInterface>({
  externalId: prop('id'),
  name: prop('name'),
  description: compose(sanitize, prop('overview')),
  wideImage: prop('poster_path'),
  tallImage: prop('poster_path'),
  isInProduction: prop('in_production'),
  status: prop('status'),
});
