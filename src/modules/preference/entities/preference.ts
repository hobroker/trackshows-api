import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Genre } from '../../show';

@ObjectType()
export class Preference {
  @Field(() => [Genre])
  genres: Genre[];

  @Field(() => [Int])
  genreIds: number[];
}
