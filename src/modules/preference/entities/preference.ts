import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Genre } from '../../show';

@ObjectType()
export class Preference {
  @Field(() => Int)
  id: number;

  @Field(() => [Genre])
  genres: Genre[];
}
