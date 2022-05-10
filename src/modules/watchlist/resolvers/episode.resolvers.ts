import 'reflect-metadata';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { GraphqlJwtAnyoneGuard, GraphqlJwtAuthGuard } from '../../auth/guards';
import {
  RequestWithAnyoneInterface,
  RequestWithUser,
} from '../../auth/interfaces';
import { Episode } from '../../show/entities/episode';
import { EpisodeService, WatchlistService } from '../services';
import { ShowService } from '../../show/services';
import { TmdbShowService } from '../../tmdb';
import { Show } from '../../show';
import { GetSeasonEpisodesInput, UpsertEpisodeInput } from './inputs';

@Injectable()
@Resolver(Episode)
export class EpisodeResolver {
  constructor(
    private readonly watchlistService: WatchlistService,
    private readonly episodeService: EpisodeService,
    private readonly showService: ShowService,
    private readonly tmdbShowService: TmdbShowService,
  ) {}

  @ResolveField()
  async show(@Parent() episode: Episode): Promise<Show> {
    return this.tmdbShowService.getShow(episode.showId);
  }

  @Query(() => [Episode])
  @UseGuards(GraphqlJwtAuthGuard)
  async listUpNext(@Context() { req: { user } }: { req: RequestWithUser }) {
    const userId = user.id;

    return this.watchlistService.listUpNext(userId);
  }

  @Query(() => [Episode])
  @UseGuards(GraphqlJwtAnyoneGuard)
  async getSeasonEpisodes(
    @Args('input') { showId, seasonNumber }: GetSeasonEpisodesInput,
    @Context() { req: { user } }: { req: RequestWithAnyoneInterface },
  ) {
    return this.episodeService.getSeasonEpisodes(
      showId,
      seasonNumber,
      user?.id,
    );
  }

  @Query(() => [Episode])
  @UseGuards(GraphqlJwtAuthGuard)
  async listUpcoming(@Context() { req: { user } }: { req: RequestWithUser }) {
    const userId = user.id;

    return this.watchlistService.listUpcoming(userId);
  }

  @Mutation(() => Episode, { nullable: true })
  @UseGuards(GraphqlJwtAuthGuard)
  async upsertEpisode(
    @Args('input') { episodeId, isWatched }: UpsertEpisodeInput,
  ) {
    await this.episodeService.upsertEpisode(episodeId, isWatched);

    return this.episodeService.getEpisodeUpNext(episodeId);
  }
}
