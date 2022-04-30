import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpsertReviewInput {
  @Field(() => Int)
  showId: number;

  @Field()
  title?: string;

  @Field()
  content?: string;
}
