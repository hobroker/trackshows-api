import { applySpec, prop } from 'rambda';
import { RawCrewInterface } from '../interfaces';

export const crewFacade = applySpec<RawCrewInterface>({
  showId: prop('showId'),
  person: prop('person'),
  department: prop('department'),
  job: prop('job'),
});
