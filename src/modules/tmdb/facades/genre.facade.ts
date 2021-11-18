import { applySpec, prop } from 'rambda';
import { GenreInterface } from '../interfaces';

export const genreFacade = applySpec<GenreInterface>({
  externalId: prop('id'),
  name: prop('name'),
});
