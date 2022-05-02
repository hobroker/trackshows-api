import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SimilarShowsInput {
  @Field(() => Int)
  externalId: number;
}
