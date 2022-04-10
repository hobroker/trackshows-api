import { Field, InputType, Int } from '@nestjs/graphql';
import { Status } from '../../entities';

@InputType()
export class UpsertWatchlistInput {
  @Field(() => Int)
  showId: number;

  @Field(() => Status)
  status: Status;
}
