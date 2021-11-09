import { applySpec, prop } from 'rambda';
import { RawCrewInterface } from '../interfaces';

export const crewFacade = applySpec<RawCrewInterface>({
  person: prop('person'),
  department: prop('department'),
  job: prop('job'),
});
