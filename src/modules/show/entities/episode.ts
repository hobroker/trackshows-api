import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PartialShow } from './partial-show';

export class __ShowChild {
  show: PartialShow;

  __meta__: {
    showId: number;
  };
}

@ObjectType()
export class Episode extends __ShowChild {
  @Field(() => Int)
  externalId: number;

  @Field(() => Int)
  number: number;

  @Field(() => Int)
  seasonNumber: number;

  @Field()
  name: string;

  @Field()
  isWatched: boolean;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  wideImage: string;

  @Field(() => Date, { nullable: true })
  airDate: Date;

  @Field(() => PartialShow)
  show: PartialShow;
}
