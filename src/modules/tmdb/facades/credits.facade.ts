import { applySpec, prop } from 'rambda';
import { CastInterface, CrewInterface } from '../interfaces';

export const castFacade = applySpec<CastInterface>({
  externalId: prop('id'),
  character: prop('character'),
  order: prop('order'),
});

export const crewFacade = applySpec<CrewInterface>({
  externalId: prop('id'),
  department: prop('department'),
  job: prop('job'),
});
