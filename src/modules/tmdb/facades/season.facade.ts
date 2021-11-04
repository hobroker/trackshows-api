import { applySpec, prop } from 'rambda';
import { RawSeasonInterface } from '../interfaces';

export const seasonFacade = applySpec<RawSeasonInterface>({
  externalId: prop('id'),
  name: prop('name'),
  description: prop('overview'),
  tallImage: prop('poster_path'),
  number: prop('season_number'),
  episodes: prop('episodes'),
});
