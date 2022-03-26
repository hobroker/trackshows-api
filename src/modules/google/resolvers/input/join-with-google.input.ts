import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class JoinWithGoogleInput {
  @Field()
  token: string;
}
