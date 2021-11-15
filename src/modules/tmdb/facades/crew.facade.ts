import { applySpec, prop } from 'rambda';
import { RawCrewInterface } from '../interfaces';

export const crewFacade = applySpec<RawCrewInterface>({
  externalId: prop('id'),
  department: prop('department'),
  job: prop('job'),
});
