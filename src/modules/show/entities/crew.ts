import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Person } from '../../person';
import { Show } from './show';

@ObjectType()
export class Crew {
  @Field(() => Int)
  id: number;

  @Field()
  department: string;

  @Field()
  job: string;

  @Field(() => Person)
  person: Person;

  @Field(() => Show)
  show: Show;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
