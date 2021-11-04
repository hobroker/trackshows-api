import { applySpec, prop } from 'rambda';
import { RawGenderInterface } from '../interfaces';

export const genderFacade = applySpec<RawGenderInterface>({
  externalId: prop('gender'),
});
