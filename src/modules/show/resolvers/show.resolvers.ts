import 'reflect-metadata';
import { Args, Context, Info, Query } from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { fieldsMap } from 'graphql-fields-list';
import { GraphQLResolveInfo } from 'graphql';
import { when } from 'ramda';
import { FullShow, PartialShow } from '../entities';
import { TmdbGenreService, TmdbShowService } from '../../tmdb';
import { ShowService, StatusService } from '../services';
import {
  RequestWithAnyoneInterface,
  RequestWithUser,
} from '../../auth/interfaces';
import { GraphqlJwtAnyoneGuard, GraphqlJwtAuthGuard } from '../../auth/guards';
import { DiscoverShowsInput, FullShowInput, TrendingInput } from './input';

@Injectable()
export class ShowResolver {
  constructor(
    private readonly tmdbShowService: TmdbShowService,
    private readonly tmdbGenreService: TmdbGenreService,
    private readonly showService: ShowService,
    private readonly statusService: StatusService,
  ) {}

  @Query(() => [PartialShow])
  @UseGuards(GraphqlJwtAuthGuard)
  async discoverShows(
    @Info() info: GraphQLResolveInfo,
    @Args('input') { genreIds }: DiscoverShowsInput,
    @Context() { req: { user } }: { req: RequestWithUser },
  ): Promise<PartialShow[]> {
    const fields = fieldsMap(info);

    return this.tmdbShowService
      .discoverByGenres(genreIds)
      .then(when(() => 'genres' in fields, this.showService.linkGenres))
      .then(
        when(
          () => 'status' in fields,
          (shows) => this.statusService.linkStatusToShows(user.id, shows),
        ),
      );
  }

  @Query(() => [PartialShow])
  @UseGuards(GraphqlJwtAuthGuard)
  async getMyShows(
    @Info() info: GraphQLResolveInfo,
    @Context() { req: { user } }: { req: RequestWithUser },
  ): Promise<PartialShow[]> {
    const fields = fieldsMap(info);

    return this.showService
      .getMyShows(user.id)
      .then(when(() => 'genres' in fields, this.showService.linkGenres))
      .then(
        when(
          () => 'status' in fields,
          (shows) => this.statusService.linkStatusToShows(user.id, shows),
        ),
      );
  }

  @Query(() => [PartialShow])
  async listTrending(
    @Args('input') { page = 1 }: TrendingInput,
  ): Promise<PartialShow[]> {
    return this.tmdbShowService.getTrending(page);
  }

  @Query(() => FullShow)
  @UseGuards(GraphqlJwtAnyoneGuard)
  async fullShow(
    @Info() info: GraphQLResolveInfo,
    @Args('input') { externalId }: FullShowInput,
    @Context() { req: { user } }: { req: RequestWithAnyoneInterface },
  ): Promise<FullShow> {
    const fields = fieldsMap(info);

    return this.tmdbShowService.getShow(externalId).then(
      when(
        () => 'status' in fields,
        (show) => this.statusService.linkStatusToShow(user?.id, show),
      ),
    );
  }
}
