import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FullShowInput {
  @Field(() => Int)
  externalId: number;
}
