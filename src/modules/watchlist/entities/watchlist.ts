import 'reflect-metadata';
import { Field, ObjectType } from '@nestjs/graphql';
import { PartialShow } from '../../show';
import { Status } from './status';

@ObjectType()
export class Watchlist {
  @Field(() => PartialShow)
  show: PartialShow;

  @Field(() => Status)
  status: Status;
}
