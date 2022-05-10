import 'reflect-metadata';
import {
  Args,
  Context,
  Info,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
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
import {
  DiscoverShowsInput,
  FullShowInput,
  ListRecommendationsInput,
  TrendingInput,
} from './input';

@Injectable()
@Resolver(PartialShow)
export class ShowResolver {
  constructor(
    private readonly tmdbShowService: TmdbShowService,
    private readonly tmdbGenreService: TmdbGenreService,
    private readonly showService: ShowService,
    private readonly statusService: StatusService,
  ) {}

  @ResolveField()
  async status(
    @Parent() show: PartialShow,
    @Context() { req: { user } }: { req: RequestWithUser },
  ) {
    return this.statusService.getStatusForShow(user.id, show);
  }

  @Query(() => [PartialShow])
  @UseGuards(GraphqlJwtAuthGuard)
  async discoverShows(
    @Args('input') { genreIds }: DiscoverShowsInput,
  ): Promise<PartialShow[]> {
    return this.tmdbShowService.discoverByGenres(genreIds);
  }

  @Query(() => [PartialShow])
  @UseGuards(GraphqlJwtAuthGuard)
  async listRecommendations(
    @Args('input') { genreIds }: ListRecommendationsInput,
    @Context() { req: { user } }: { req: RequestWithUser },
  ): Promise<PartialShow[]> {
    return this.showService.listRecommendations(user.id, genreIds);
  }

  @Query(() => [PartialShow])
  @UseGuards(GraphqlJwtAuthGuard)
  async getMyShows(
    @Context() { req: { user } }: { req: RequestWithUser },
  ): Promise<PartialShow[]> {
    return this.showService.getMyShows(user.id);
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
