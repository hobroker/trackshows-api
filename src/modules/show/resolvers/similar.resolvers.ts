import 'reflect-metadata';
import { Args, Info, Query } from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { fieldsMap } from 'graphql-fields-list';
import { GraphQLResolveInfo } from 'graphql';
import { when } from 'ramda';
import { PartialShow } from '../entities';
import { TmdbGenreService, TmdbShowService } from '../../tmdb';
import { ShowService } from '../services';
import { GraphqlJwtAnyoneGuard } from '../../auth/guards';
import { SimilarShowsInput } from './input';

@Injectable()
export class SimilarResolver {
  constructor(
    private readonly tmdbShowService: TmdbShowService,
    private readonly tmdbGenreService: TmdbGenreService,
    private readonly showService: ShowService,
  ) {}

  @Query(() => [PartialShow])
  @UseGuards(GraphqlJwtAnyoneGuard)
  async getSimilarShows(
    @Info() info: GraphQLResolveInfo,
    @Args('input') { externalId }: SimilarShowsInput,
  ): Promise<PartialShow[]> {
    const fields = fieldsMap(info);

    return this.tmdbShowService
      .getRecommendations(externalId)
      .then(when(() => 'genres' in fields, this.showService.linkGenres));
  }
}
