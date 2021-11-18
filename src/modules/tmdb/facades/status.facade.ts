import { applySpec, prop } from 'rambda';
import { StatusInterface } from '../interfaces';

export const statusFacade = applySpec<StatusInterface>({
  name: prop('status'),
});
