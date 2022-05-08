import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SearchInput {
  @Field()
  query: string;
}
