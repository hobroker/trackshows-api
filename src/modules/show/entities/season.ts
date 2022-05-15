import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Season {
  @Field(() => Int)
  showId: number;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field({ nullable: true })
  tallImage: string;

  @Field(() => Int)
  number: number;

  @Field()
  episodeCount: string;

  @Field({ nullable: true })
  airDate: Date;

  @Field()
  isFullyWatched: boolean;
}
