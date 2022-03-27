import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/entities';

@ObjectType()
export class Preference {
  @Field(() => Int)
  id: number;

  @Field(() => User)
  user: User;

  @Field(() => [Int])
  genreIds: number[];

  @Field(() => [Int])
  showIds: number[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
