import { applySpec, prop } from 'rambda';
import { RawEpisodeInterface } from '../interfaces';

export const episodeFacade = applySpec<RawEpisodeInterface>({
  externalId: prop('id'),
  name: prop('name'),
  description: prop('overview'),
  wideImage: prop('still_path'),
  airDate: prop('air_date'),
  number: prop('episode_number'),
});
