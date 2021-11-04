import { applySpec, prop } from 'rambda';
import { RawStatusInterface } from '../interfaces';

export const statusFacade = applySpec<RawStatusInterface>({
  name: prop('status'),
});
