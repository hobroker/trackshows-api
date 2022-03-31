import 'reflect-metadata';
import { Args, Info, Query } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { fieldsMap } from 'graphql-fields-list';
import { GraphQLResolveInfo } from 'graphql';
import { indexBy, prop } from 'rambda';
import { PartialShow } from '../entities';
import { DiscoverShowsInput } from './input';
import { TmdbGenreService, TmdbShowService } from '../../tmdb';

@Injectable()
export class ShowResolver {
  constructor(
    private readonly tmdbShowService: TmdbShowService,
    private readonly tmdbGenreService: TmdbGenreService,
  ) {}

  @Query(() => [PartialShow])
  async discoverShows(
    @Args('input') input: DiscoverShowsInput,
    @Info() info: GraphQLResolveInfo,
  ) {
    const { genreIds } = input;
    const fields = fieldsMap(info);

    const shows = await this.tmdbShowService.discoverByGenres(genreIds);

    if (!('genres' in fields)) {
      return shows;
    }

    const genres = await this.tmdbGenreService
      .list()
      .then(indexBy(prop('externalId')));

    return shows.map(({ genreIds, ...show }) => ({
      ...show,
      genres: genreIds.map((id) => genres[id]),
    }));
  }
}
