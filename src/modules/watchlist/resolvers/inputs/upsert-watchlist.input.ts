import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ShowWithStatusInput {
  @Field(() => Int)
  showId: number;

  @Field(() => Int)
  statusId: number;
}
//
// @InputType()
// export class UpsertWatchlistInput {
//   @Field(() => [ShowIdWithStatusId])
//   showsWithStatuses: ShowIdWithStatusId[];
// }
