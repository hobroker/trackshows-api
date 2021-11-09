import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Show } from './show';

@ObjectType()
export class Season {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  tallImage: string;

  @Field(() => Int)
  number: number;

  @Field(() => Show)
  show: Show;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
