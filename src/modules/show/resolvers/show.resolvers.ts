import 'reflect-metadata';
import { Args, Context, Info, Query } from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { fieldsMap } from 'graphql-fields-list';
import { GraphQLResolveInfo } from 'graphql';
import { when } from 'rambda';
import { PartialShow } from '../entities';
import { TmdbGenreService, TmdbShowService } from '../../tmdb';
import { ShowService } from '../services';
import { RequestWithUser } from '../../auth/interfaces';
import { GraphqlJwtAuthGuard } from '../../auth/guards';
import { DiscoverShowsInput } from './input';

@Injectable()
export class ShowResolver {
  constructor(
    private readonly tmdbShowService: TmdbShowService,
    private readonly tmdbGenreService: TmdbGenreService,
    private readonly showService: ShowService,
  ) {}

  @Query(() => [PartialShow])
  @UseGuards(GraphqlJwtAuthGuard)
  async discoverShows(
    @Args('input') input: DiscoverShowsInput,
    @Info() info: GraphQLResolveInfo,
    @Context() { req: { user } }: { req: RequestWithUser },
  ): Promise<PartialShow[]> {
    const { genreIds } = input;
    const fields = fieldsMap(info);

    return this.tmdbShowService
      .discoverByGenres(genreIds)
      .then(when(() => 'genres' in fields, this.showService.linkGenres))
      .then(
        when(
          () => 'status' in fields,
          (shows) => this.showService.linkStatus(user.id, shows),
        ),
      );
  }
}
