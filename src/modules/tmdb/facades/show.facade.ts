import { applySpec, compose, defaultTo, head, map, prop, propOr } from 'ramda';
import { sanitize, toDate } from '../../../util/fp';
import { Show } from '../../show';
import { seasonFacade } from './season.facade';
import { genreFacade } from './genre.facade';

export const showFacade = applySpec<Show>({
  externalId: prop('id'),
  name: prop('name'),
  description: compose(sanitize, prop('overview')),
  wideImage: prop('backdrop_path'),
  tallImage: prop('poster_path'),
  originCountry: compose(head, prop('origin_country')),
  firstAirDate: compose(toDate, prop('first_air_date')),
  genres: compose(map(genreFacade), propOr([], 'genres')),
  episodeRuntime: compose(defaultTo(0), head, propOr([0], 'episode_run_time')),
  isInProduction: propOr(false, 'in_production'),
  tagline: propOr('', 'tagline'),
  seasons: ({ id: showId, seasons }) =>
    (seasons || [])
      .map(seasonFacade)
      .filter(({ episodeCount }) => Number(episodeCount) > 0)
      .map((item) => ({ ...item, showId })),
});
