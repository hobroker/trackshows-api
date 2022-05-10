import { applySpec, compose, filter, head, map, prop, propOr } from 'ramda';
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
  __meta__: {
    genreIds: prop('genre_ids'),
  },
  genres: compose(map(genreFacade), propOr([], 'genres')),
  episodeRuntime: compose(head, propOr([0], 'episode_run_time')),
  isInProduction: propOr(false, 'in_production'),
  tagline: propOr('', 'tagline'),
  seasons: compose(
    filter(({ episodeCount }) => Number(episodeCount) > 0),
    map(seasonFacade),
    propOr([], 'seasons'),
  ),
});
