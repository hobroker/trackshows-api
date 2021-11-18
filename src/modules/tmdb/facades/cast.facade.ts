import { applySpec, prop } from 'rambda';
import { CastInterface } from '../interfaces';

export const castFacade = applySpec<CastInterface>({
  externalId: prop('id'),
  character: prop('character'),
  order: prop('order'),
});
