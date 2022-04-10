import { applySpec, prop } from 'ramda';
import { KeywordInterface } from '../interfaces';

export const keywordFacade = applySpec<KeywordInterface>({
  externalId: prop('id'),
  name: prop('name'),
});
