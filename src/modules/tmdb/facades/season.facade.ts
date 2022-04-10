import { applySpec, prop } from 'ramda';
import { SeasonInterface } from '../interfaces';

export const seasonFacade = applySpec<SeasonInterface>({
  externalId: prop('id'),
  name: prop('name'),
  description: prop('overview'),
  tallImage: prop('poster_path'),
  number: prop('season_number'),
});
