import 'reflect-metadata';
import { Args, Context, Mutation, Query } from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from '../../auth/guards';
import { RequestWithUser } from '../../auth/interfaces';
import { Episode } from '../../show/entities/episode';
import { Watchlist } from '../entities';
import { EpisodeService, WatchlistService } from '../services';
import { ShowWithStatusInput } from './inputs';

@Injectable()
export class WatchlistResolver {
  constructor(
    private readonly watchlistService: WatchlistService,
    private readonly episodeService: EpisodeService,
  ) {}

  @Mutation(() => Watchlist)
  @UseGuards(GraphqlJwtAuthGuard)
  async upsertWatchlistItem(
    @Args('input') { showId, status }: ShowWithStatusInput,
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
  async listUpNext(@Context() { req: { user } }: { req: RequestWithUser }) {
    const userId = user.id;

    return this.watchlistService.listUpNext(userId);
  }
}
