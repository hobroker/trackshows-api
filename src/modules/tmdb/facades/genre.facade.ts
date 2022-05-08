import { applySpec, prop } from 'ramda';
import { Genre } from '../../show';

export const genreFacade = applySpec<Genre>({
  externalId: prop('id'),
  name: prop('name'),
});
