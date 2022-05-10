import 'reflect-metadata';
import {
  Args,
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { Show } from '../entities';
import { TmdbGenreService, TmdbShowService } from '../../tmdb';
import { ShowService, StatusService } from '../services';
import { RequestWithUser } from '../../auth/interfaces';
import { GraphqlJwtAnyoneGuard, GraphqlJwtAuthGuard } from '../../auth/guards';
import { Status } from '../../watchlist/entities';
import {
  DiscoverShowsInput,
  FullShowInput,
  ListRecommendationsInput,
  SimilarShowsInput,
  TrendingInput,
} from './input';

@Injectable()
@Resolver(Show)
export class ShowResolver {
  constructor(
    private readonly tmdbShowService: TmdbShowService,
    private readonly tmdbGenreService: TmdbGenreService,
    private readonly showService: ShowService,
    private readonly statusService: StatusService,
  ) {}

  @ResolveField()
  async status(
    @Parent() show: Show,
    @Context() { req: { user } }: { req: RequestWithUser },
  ): Promise<Status> {
    if (!user) return Status.None;

    return this.statusService.getStatusForShow(user.id, show);
  }

  @Query(() => [Show])
  @UseGuards(GraphqlJwtAuthGuard)
  async discoverShows(
    @Args('input') { genreIds }: DiscoverShowsInput,
  ): Promise<Show[]> {
    return this.tmdbShowService.discoverByGenres(genreIds);
  }

  @Query(() => [Show])
  @UseGuards(GraphqlJwtAuthGuard)
  async listRecommendations(
    @Args('input') { genreIds }: ListRecommendationsInput,
    @Context() { req: { user } }: { req: RequestWithUser },
  ): Promise<Show[]> {
    return this.showService.listRecommendations(user.id, genreIds);
  }

  @Query(() => [Show])
  @UseGuards(GraphqlJwtAuthGuard)
  async getMyShows(
    @Context() { req: { user } }: { req: RequestWithUser },
  ): Promise<Show[]> {
    return this.showService.getMyShows(user.id);
  }

  @Query(() => [Show])
  async listTrending(
    @Args('input') { page = 1 }: TrendingInput,
  ): Promise<Show[]> {
    return this.tmdbShowService.getTrending(page);
  }

  @Query(() => Show)
  @UseGuards(GraphqlJwtAnyoneGuard)
  async fullShow(@Args('input') { externalId }: FullShowInput): Promise<Show> {
    return this.tmdbShowService.getShow(externalId);
  }

  @Query(() => [Show])
  async getSimilarShows(
    @Args('input') { externalId }: SimilarShowsInput,
  ): Promise<Show[]> {
    return this.tmdbShowService.getRecommendations(externalId);
  }
}
