import { applySpec, compose, prop } from 'ramda';
import { toDate } from '../../../util/fp';
import { Season } from '../../show/entities/season';

export const seasonFacade = applySpec<Season>({
  externalId: prop('id'),
  name: prop('name'),
  description: prop('overview'),
  tallImage: prop('poster_path'),
  number: prop('season_number'),
  episodeCount: prop('episode_count'),
  airDate: compose(toDate, prop('air_date')),
});
