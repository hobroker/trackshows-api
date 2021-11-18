import { applySpec, prop } from 'rambda';
import { ProductionCompanyInterface } from '../interfaces';

export const productionCompanyFacade = applySpec<ProductionCompanyInterface>({
  externalId: prop('id'),
  name: prop('name'),
  logo: prop('logo_path'),
});
