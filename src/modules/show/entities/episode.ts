import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Season } from './season';

@ObjectType()
export class Episode {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  wideImage: string;

  @Field(() => Date)
  airDate: Date;

  @Field(() => Int)
  number: number;

  @Field(() => Season)
  season: Season;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
