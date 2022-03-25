import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserCreateInput {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field({ nullable: true })
  password: string;
}
