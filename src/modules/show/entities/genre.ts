import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Show } from './show';

@ObjectType()
export class Genre {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => [Show], { nullable: true })
  shows: Show;

  @Field(() => Int)
  externalId: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
