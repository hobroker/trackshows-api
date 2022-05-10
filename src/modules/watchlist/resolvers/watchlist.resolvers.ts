import 'reflect-metadata';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from '../../auth/guards';
import { RequestWithUser } from '../../auth/interfaces';
import { Watchlist } from '../entities';
import { WatchlistService } from '../services';
import { UpsertWatchlistInput } from './inputs';

@Injectable()
@Resolver(Watchlist)
export class WatchlistResolver {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Mutation(() => Watchlist)
  @UseGuards(GraphqlJwtAuthGuard)
  async upsertWatchlistItem(
    @Args('input') { showId, status }: UpsertWatchlistInput,
    @Context() { req: { user } }: { req: RequestWithUser },
  ) {
    const statusId = status;

    return this.watchlistService.upsert(
      { showId, userId: user.id },
      { statusId },
    );
  }

  @Query(() => [Watchlist])
  @UseGuards(GraphqlJwtAuthGuard)
  async getWatchlist(@Context() { req: { user } }: { req: RequestWithUser }) {
    return this.watchlistService.listByUserId(user.id);
  }
}
