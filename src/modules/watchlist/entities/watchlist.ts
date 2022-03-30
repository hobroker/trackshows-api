import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/entities';
import { PartialShow } from '../../show';
import { Status } from './status';

@ObjectType()
export class Watchlist {
  @Field(() => Int)
  id: number;

  @Field(() => User)
  user: User;

  @Field(() => PartialShow)
  show: PartialShow;

  @Field(() => Status)
  status: Status;
}
