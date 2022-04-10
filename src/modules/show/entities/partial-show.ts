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

  @Field(() => [Genre])
  genres: Genre[];

  @Field(() => Status)
  status: Status;

  __meta__: {
    genreIds: number[];
  };
}
