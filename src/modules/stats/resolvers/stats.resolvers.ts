import 'reflect-metadata';
import { Context, Query } from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { StatsSummaryItem, StatsCalendarItem, PieItem } from '../entities';
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

  @Query(() => [PieItem])
  @UseGuards(GraphqlJwtAuthGuard)
  async getStatsGenres(
    @Context() { req: { user } }: { req: RequestWithUser },
  ): Promise<PieItem[]> {
    return this.statsService.getGenresSummary(user.id);
  }
}
