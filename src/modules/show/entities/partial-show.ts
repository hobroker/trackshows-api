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

  @Field({ nullable: true })
  wideImage: string;

  @Field({ nullable: true })
  tallImage: string;

  @Field()
  originCountry?: string;

  @Field()
  firstAirDate: Date;

  @Field(() => [Genre])
  genres: Genre[];

  @Field(() => Status)
  status: Status;

  __meta__: {
    genreIds: number[];
  };
}
