import { applySpec, prop } from 'rambda';
import { RawCrewInterface } from '../interfaces';

export const crewFacade = applySpec<RawCrewInterface>({
  personId: prop('id'),
  department: prop('department'),
  job: prop('job'),
});
