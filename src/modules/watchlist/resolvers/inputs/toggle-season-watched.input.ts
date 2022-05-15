import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ToggleSeasonWatchedInput {
  @Field(() => Int)
  showId: number;

  @Field(() => Int)
  seasonNumber: number;
}
