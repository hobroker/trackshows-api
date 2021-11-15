import { applySpec, prop } from 'rambda';
import { RawCastInterface } from '../interfaces';

export const castFacade = applySpec<RawCastInterface>({
  externalId: prop('id'),
  character: prop('character'),
  order: prop('order'),
});
