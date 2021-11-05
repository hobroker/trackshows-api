import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Status } from './status';
import { Keyword } from './keyword';
import { Genre } from './genre';

@ObjectType()
export class Show {
  @Field(() => Int)
  id: number;

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

  @Field()
  status: Status;

  @Field(() => [Genre])
  genres: [Genre];

  @Field(() => [Keyword])
  keywords: [Keyword];

  @Field(() => Int)
  externalId: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
