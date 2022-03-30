import 'reflect-metadata';
import { Args, Context, Mutation } from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from '../../auth/guards';
import { WatchlistService } from '../services';
import { ShowWithStatusInput } from './inputs';
import { RequestWithUser } from '../../auth/interfaces';
import { Void } from '../../../util/void';
import { Watchlist } from '../entities';

@Injectable()
export class WatchlistResolver {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Mutation(() => Void)
  @UseGuards(GraphqlJwtAuthGuard)
  async upsertWatchlist(
    @Args('input', { type: () => [ShowWithStatusInput] })
    input: ShowWithStatusInput[],
    @Context() { req: { user } }: { req: RequestWithUser },
  ) {
    const userId = user.id;

    await Promise.all(
      input.map(({ showId, statusId }) => {
        return this.watchlistService.upsert({ showId, userId }, { statusId });
      }),
    );

    return {};
  }

  @Mutation(() => Watchlist)
  @UseGuards(GraphqlJwtAuthGuard)
  async getWatchlist(@Context() { req: { user } }: { req: RequestWithUser }) {
    return this.watchlistService.listByUserId(user.id);
  }
}
