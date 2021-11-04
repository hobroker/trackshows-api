import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Gender {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => Int)
  externalId: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
