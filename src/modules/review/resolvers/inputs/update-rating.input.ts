import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateRatingInput {
  @Field(() => Int)
  showId: number;

  @Field(() => Int)
  rating?: number;
}
