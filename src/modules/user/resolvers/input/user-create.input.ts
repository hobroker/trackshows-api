import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserCreateInput {
  @Field()
  email: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  password: string;
}
