import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Genre } from './genre';

@ObjectType()
export class PartialShow {
  @Field(() => Int)
  externalId: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  wideImage: string;

  @Field()
  tallImage: string;

  @Field(() => [Genre])
  genres: [Genre];
}