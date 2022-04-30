import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetReviewInput {
  @Field(() => Int)
  showId: number;
}
