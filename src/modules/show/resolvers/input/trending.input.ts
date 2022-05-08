import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class TrendingInput {
  @Field(() => Int, { nullable: true })
  page?: number;
}
