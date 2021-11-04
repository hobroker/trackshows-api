import { applySpec, compose, prop } from 'rambda';
import { RawPersonInterface } from '../interfaces';
import { toDate } from '../../../util/fp';
import { genderFacade } from './gender.facade';

export const personFacade = applySpec<RawPersonInterface>({
  name: prop('name'),
  description: prop('biography'),
  image: prop('profile_path'),
  birthday: compose(toDate, prop('birthday')),
  deathday: compose(toDate, prop('deathday')),
  externalId: prop('id'),
  gender: genderFacade,
});
