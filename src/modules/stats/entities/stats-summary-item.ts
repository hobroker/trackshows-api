import 'reflect-metadata';
import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum StatsSummaryItemKey {
  WatchingTvShowsCount,
  WatchedEpisodesCount,
  SpentMinutes,
}

registerEnumType(StatsSummaryItemKey, { name: 'StatsSummaryItemKey' });

@ObjectType()
export class StatsSummaryItem {
  @Field(() => StatsSummaryItemKey)
  key: StatsSummaryItemKey;

  @Field(() => Int)
  value: number;
}
