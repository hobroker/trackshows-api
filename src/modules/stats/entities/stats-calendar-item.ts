import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StatsCalendarItem {
  @Field()
  day: string;

  @Field(() => Int)
  value: number;
}
