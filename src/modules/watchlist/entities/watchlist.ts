import 'reflect-metadata';
import { Field, ObjectType } from '@nestjs/graphql';
import { Show } from '../../show';
import { Status } from './status';

@ObjectType()
export class Watchlist {
  @Field(() => Show)
  show: Show;

  @Field(() => Status)
  status: Status;
}
