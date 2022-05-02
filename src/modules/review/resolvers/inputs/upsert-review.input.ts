import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpsertReviewInput {
  @Field(() => Int)
  showId: number;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  content?: string;

  @Field(() => Int, { nullable: true })
  rating?: number;
}
