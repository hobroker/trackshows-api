import 'reflect-metadata';
import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { RequestWithUser } from '../../auth/interfaces';
import { Season } from '../../show/entities/season';
import { SeasonService } from '../services';

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
      season.showId,
      season.number,
    );
  }
}
