import { applySpec, prop } from 'rambda';
import { RawGenreInterface } from '../interfaces';

export const genreFacade = applySpec<RawGenreInterface>({
  externalId: prop('id'),
  name: prop('name'),
});
