import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpsertEpisodeInput {
  @Field(() => Int)
  episodeId: number;

  @Field(() => Boolean)
  isWatched: boolean;
}
