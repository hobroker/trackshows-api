import 'reflect-metadata';
import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { RequestWithUser } from '../../auth/interfaces';
import { Season } from '../../show/entities/season';
import { SeasonService } from '../services';
import { GraphqlJwtAuthGuard } from '../../auth/guards';
import { Void } from '../../../util/void';
import { ToggleSeasonWatchedInput } from './inputs/toggle-season-watched.input';

@Injectable()
@Resolver(Season)
export class SeasonResolver {
  constructor(private readonly seasonService: SeasonService) {}

  @ResolveField()
  async isFullyWatched(
    @Parent() season: Season,
    @Context() { req: { user } }: { req: RequestWithUser },
  ) {
    if (!user) return false;

    return this.seasonService.getIsSeasonFullyWatched(
      user.id,
      season.showId,
      season.number,
    );
  }

  @Mutation(() => Void)
  @UseGuards(GraphqlJwtAuthGuard)
  async toggleSeasonIsFullyWatched(
    @Args('input') { showId, seasonNumber }: ToggleSeasonWatchedInput,
    @Context() { req: { user } }: { req: RequestWithUser },
  ) {
    return this.seasonService.toggleSeasonIsFullyWatched(
      user.id,
      showId,
      seasonNumber,
    );
  }
}
