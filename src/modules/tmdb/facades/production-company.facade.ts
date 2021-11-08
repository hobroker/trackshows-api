import { applySpec, prop } from 'rambda';
import { RawProductionCompanyInterface } from '../interfaces';

export const productionCompanyFacade = applySpec<RawProductionCompanyInterface>(
  {
    name: prop('name'),
    logo: prop('logo_path'),
  },
);
