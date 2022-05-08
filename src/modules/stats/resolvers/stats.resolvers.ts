import 'reflect-metadata';
import { Context, Query } from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { StatsSummaryItem } from '../entities';
import { GraphqlJwtAuthGuard } from '../../auth/guards';
import { StatsService } from '../services';
import { RequestWithUser } from '../../auth/interfaces';

@Injectable()
export class StatsResolver {
  constructor(private statsService: StatsService) {}

  @Query(() => [StatsSummaryItem])
  @UseGuards(GraphqlJwtAuthGuard)
  async getStatsSummary(
    @Context() { req: { user } }: { req: RequestWithUser },
  ) {
    return this.statsService.getSummary(user.id);
  }
}
