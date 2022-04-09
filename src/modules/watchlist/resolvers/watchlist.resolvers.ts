import 'reflect-metadata';
import { Args, Context, Info, Mutation, Query } from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { when } from 'rambda';
import { fieldsMap } from 'graphql-fields-list';
import { GraphQLResolveInfo } from 'graphql';
import { GraphqlJwtAuthGuard } from '../../auth/guards';
import { RequestWithUser } from '../../auth/interfaces';
import { Episode } from '../../show/entities/episode';
import { Watchlist } from '../entities';
import { EpisodeService, WatchlistService } from '../services';
import { ShowService } from '../../show/services';
import { UpsertWatchlistInput } from './inputs';

@Injectable()
export class WatchlistResolver {
  constructor(
    private readonly watchlistService: WatchlistService,
    private readonly episodeService: EpisodeService,
    private readonly showService: ShowService,
  ) {}

  @Mutation(() => Watchlist)
  @UseGuards(GraphqlJwtAuthGuard)
  async upsertWatchlistItem(
    @Args('input') { showId, status }: UpsertWatchlistInput,
    @Context() { req: { user } }: { req: RequestWithUser },
  ) {
    const userId = user.id;
    const statusId = status;

    return this.watchlistService.upsert({ showId, userId }, { statusId });
  }

  @Query(() => [Watchlist])
  @UseGuards(GraphqlJwtAuthGuard)
  async getWatchlist(@Context() { req: { user } }: { req: RequestWithUser }) {
    return await this.watchlistService.listByUserId(user.id);
  }

  @Query(() => [Episode])
  @UseGuards(GraphqlJwtAuthGuard)
  async listUpNext(
    @Info() info: GraphQLResolveInfo,
    @Context() { req: { user } }: { req: RequestWithUser },
  ) {
    const userId = user.id;
    const fields = fieldsMap(info);

    return this.watchlistService
      .listUpNext(userId)
      .then((data) => data.map((item) => ({ ...item, isWatched: false })))
      .then(when(() => 'show' in fields, this.showService.linkShows));
  }
}
