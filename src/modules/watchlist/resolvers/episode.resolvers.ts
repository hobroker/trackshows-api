import 'reflect-metadata';
import { Args, Context, Info, Mutation, Query } from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { when } from 'rambda';
import { fieldsMap } from 'graphql-fields-list';
import { GraphQLResolveInfo } from 'graphql';
import { GraphqlJwtAuthGuard } from '../../auth/guards';
import { RequestWithUser } from '../../auth/interfaces';
import { Episode } from '../../show/entities/episode';
import { EpisodeService, WatchlistService } from '../services';
import { ShowService } from '../../show/services';
import { Void } from '../../../util/void';
import { UpsertEpisodeInput } from './inputs';

@Injectable()
export class EpisodeResolver {
  constructor(
    private readonly watchlistService: WatchlistService,
    private readonly episodeService: EpisodeService,
    private readonly showService: ShowService,
  ) {}

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

  @Mutation(() => [Void])
  @UseGuards(GraphqlJwtAuthGuard)
  async upsertEpisode(
    @Args('input') { episodeId, isWatched }: UpsertEpisodeInput,
  ) {
    await this.episodeService.upsertEpisode(episodeId, isWatched);

    return {};
  }
}
