import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Status } from '../../watchlist/entities';
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

  @Field()
  originCountry?: string;

  @Field()
  firstAirDate: Date;

  @Field(() => [Genre])
  genres: Genre[];

  @Field(() => Status)
  status: Status;

  @Field(() => Int)
  rating?: number;

  __meta__: {
    genreIds: number[];
  };
}
