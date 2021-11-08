import { applySpec, prop } from 'rambda';
import { RawProductionCompanyInterface } from '../interfaces';

export const productionCompanyFacade = applySpec<RawProductionCompanyInterface>(
  {
    externalId: prop('id'),
    name: prop('name'),
    logo: prop('logo_path'),
  },
);
