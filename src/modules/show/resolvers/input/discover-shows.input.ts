import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class DiscoverShowsInput {
  @Field(() => [Int])
  genreIds: number[];
}
