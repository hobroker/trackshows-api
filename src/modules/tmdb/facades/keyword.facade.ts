import { applySpec, prop } from 'rambda';
import { RawKeywordInterface } from '../interfaces';

export const keywordFacade = applySpec<RawKeywordInterface>({
  externalId: prop('id'),
  name: prop('name'),
});
