import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Season } from './season';

@ObjectType()
export class Episode {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  wideImage: string;

  @Field(() => Date)
  airDate: Date;

  @Field(() => Int)
  number: number;

  @Field(() => Season)
  season: Season;

  @Field(() => Int)
  externalId: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
