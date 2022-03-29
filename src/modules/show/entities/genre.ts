import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Genre {
  @Field(() => Int)
  externalId: number;

  @Field()
  name: string;
}
