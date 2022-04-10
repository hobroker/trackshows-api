import { applySpec, compose, prop } from 'ramda';
import { toDate } from '../../../util/fp';
import { Episode } from '../../show/entities/episode';

export const episodeFacade = applySpec<Episode>({
  externalId: prop('id'),
  seasonNumber: prop('season_number'),
  number: prop('episode_number'),
  name: prop('name'),
  description: prop('overview'),
  wideImage: prop('still_path'),
  airDate: compose(toDate, prop('air_date')),

  __meta__: {
    showId: prop('showId'),
  },
});
