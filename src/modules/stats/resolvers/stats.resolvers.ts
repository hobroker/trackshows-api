import 'reflect-metadata';
import { Context, Query } from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { StatsSummaryItem } from '../entities';
import { GraphqlJwtAuthGuard } from '../../auth/guards';
import { StatsService } from '../services';
import { RequestWithUser } from '../../auth/interfaces';
import { StatsCalendarItem } from '../entities/stats-calendar-item';

@Injectable()
export class StatsResolver {
  constructor(private statsService: StatsService) {}

  @Query(() => [StatsSummaryItem])
  @UseGuards(GraphqlJwtAuthGuard)
  async getStatsSummary(
    @Context() { req: { user } }: { req: RequestWithUser },
  ): Promise<StatsSummaryItem[]> {
    return this.statsService.getSummary(user.id);
  }

  @Query(() => [StatsCalendarItem])
  @UseGuards(GraphqlJwtAuthGuard)
  async getStatsCalendar(
    @Context() { req: { user } }: { req: RequestWithUser },
  ): Promise<StatsCalendarItem[]> {
    return this.statsService.getCalendarSummary(user.id);
  }
}
