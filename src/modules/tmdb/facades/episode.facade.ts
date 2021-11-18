import { applySpec, compose, prop } from 'rambda';
import { EpisodeInterface } from '../interfaces';
import { toDate } from '../../../util/fp';

export const episodeFacade = applySpec<EpisodeInterface>({
  externalId: prop('id'),
  name: prop('name'),
  description: prop('overview'),
  wideImage: prop('still_path'),
  airDate: compose(toDate, prop('air_date')),
  number: prop('episode_number'),
});
