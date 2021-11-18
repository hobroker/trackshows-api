import { applySpec, prop } from 'rambda';
import { CrewInterface } from '../interfaces';

export const crewFacade = applySpec<CrewInterface>({
  externalId: prop('id'),
  department: prop('department'),
  job: prop('job'),
});
