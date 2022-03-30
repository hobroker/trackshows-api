import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpsertPreferenceInput {
  @Field(() => [Int])
  genreIds: number[];
}
