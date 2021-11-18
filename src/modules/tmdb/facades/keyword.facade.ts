import { applySpec, prop } from 'rambda';
import { KeywordInterface } from '../interfaces';

export const keywordFacade = applySpec<KeywordInterface>({
  externalId: prop('id'),
  name: prop('name'),
});
