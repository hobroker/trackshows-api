import { applySpec, prop } from 'ramda';
import { StatusInterface } from '../interfaces';

export const statusFacade = applySpec<StatusInterface>({
  name: prop('status'),
});
