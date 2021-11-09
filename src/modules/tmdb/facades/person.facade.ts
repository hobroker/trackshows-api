import { applySpec, compose, prop } from 'rambda';
import { RawPersonInterface } from '../interfaces';
import { sanitize, toDate } from '../../../util/fp';

export const personFacade = applySpec<RawPersonInterface>({
  name: prop('name'),
  description: compose(sanitize, prop('biography')),
  image: prop('profile_path'),
  birthday: compose(toDate, prop('birthday')),
  deathday: compose(toDate, prop('deathday')),
  externalId: prop('id'),
  externalGenderId: prop('gender'),
});
