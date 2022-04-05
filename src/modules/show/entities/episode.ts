import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Episode {
  @Field(() => Int)
  externalId: number;

  @Field(() => Int)
  number: number;

  @Field(() => Int)
  seasonNumber: number;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  wideImage: string;

  @Field(() => Date, { nullable: true })
  airDate: Date;
}
