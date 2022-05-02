import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetRatingInput {
  @Field(() => Int)
  showId: number;
}
