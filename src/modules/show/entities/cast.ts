import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Person } from '../../person';
import { Show } from './show';

@ObjectType()
export class Cast {
  @Field(() => Int)
  id: number;

  @Field()
  character: string;

  @Field(() => Int)
  order: number;

  @Field(() => Person)
  person: Person;

  @Field(() => Show)
  show: Show;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
