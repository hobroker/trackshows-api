import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/entities';

@ObjectType()
export class Review {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  rating?: number;

  @Field()
  title?: string;

  @Field()
  content?: string;

  @Field(() => User)
  user: User;
}
