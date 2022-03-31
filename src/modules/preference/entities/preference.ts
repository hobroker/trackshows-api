import 'reflect-metadata';
import { Field, ObjectType } from '@nestjs/graphql';
import { Genre } from '../../show';

@ObjectType()
export class Preference {
  @Field(() => [Genre])
  genres: Genre[];
}
