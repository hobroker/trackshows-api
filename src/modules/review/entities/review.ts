import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/entities';

@ObjectType()
export class Review {
  @Field(() => Int)
  id: number;

  @Field(() => Int, { nullable: true })
  rating?: number;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  content?: string;

  @Field(() => User)
  user: User;
}
