import { applySpec, compose, prop } from 'ramda';
import { SeasonInterface } from '../interfaces';
import { toDate } from '../../../util/fp';

export const seasonFacade = applySpec<SeasonInterface>({
  externalId: prop('id'),
  name: prop('name'),
  description: prop('overview'),
  tallImage: prop('poster_path'),
  number: prop('season_number'),
  episodeCount: prop('episode_count'),
  airDate: compose(toDate, prop('air_date')),
});
