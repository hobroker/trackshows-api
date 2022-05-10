import { applySpec, compose, filter, head, map, prop } from 'ramda';
import { sanitize, toDate } from '../../../util/fp';
import { Show } from '../../show';
import { seasonFacade } from './season.facade';
import { genreFacade } from './genre.facade';

const partialShow = {
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
};

export const partialShowFacade = applySpec<Show>(partialShow);

export const fullShowFacade = applySpec<Show>({
  ...partialShow,
  genres: compose(map(genreFacade), prop('genres')),
  episodeRuntime: compose(head, prop('episode_run_time')),
  isInProduction: prop('in_production'),
  tagline: prop('tagline'),
  seasons: compose(
    filter(({ episodeCount }) => Number(episodeCount) > 0),
    map(seasonFacade),
    prop('seasons'),
  ),
});
