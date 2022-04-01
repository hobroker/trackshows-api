import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PartialShow } from '../../show';
import { Status } from './status';

@ObjectType()
export class Watchlist {
  @Field(() => Int)
  id: number;

  @Field(() => PartialShow)
  show: PartialShow;

  @Field(() => Status)
  status: Status;
}
