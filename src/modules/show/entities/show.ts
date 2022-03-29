import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Genre } from './genre';

@ObjectType()
export class Show {
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

  @Field(() => Int)
  episodeRuntime: number;

  @Field()
  isInProduction: boolean;

  @Field(() => [Genre])
  genres: [Genre];
}
