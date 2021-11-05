import { applySpec, compose, prop } from 'rambda';
import { RawEpisodeInterface } from '../interfaces';
import { toDate } from '../../../util/fp';

export const episodeFacade = applySpec<RawEpisodeInterface>({
  externalId: prop('id'),
  name: prop('name'),
  description: prop('overview'),
  wideImage: prop('still_path'),
  airDate: compose(toDate, prop('air_date')),
  number: prop('episode_number'),
});
