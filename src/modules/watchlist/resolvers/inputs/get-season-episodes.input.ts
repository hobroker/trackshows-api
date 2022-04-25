import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetSeasonEpisodesInput {
  @Field(() => Int)
  showId: number;

  @Field(() => Int)
  seasonNumber: number;
}
