import { applySpec, prop } from 'rambda';
import { RawCastInterface } from '../interfaces';

export const castFacade = applySpec<RawCastInterface>({
  person: prop('person'),
  character: prop('character'),
  order: prop('order'),
});
