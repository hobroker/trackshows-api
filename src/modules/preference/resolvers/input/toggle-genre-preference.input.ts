import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ToggleGenrePreferenceInput {
  @Field(() => Int)
  genreId: number;
}
