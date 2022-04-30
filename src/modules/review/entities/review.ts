import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Review {
  @Field(() => Int)
  rating?: number;

  @Field()
  title?: string;

  @Field()
  content?: string;
}
