import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Season } from './season';

@ObjectType()
export class ShowDetails {
  @Field(() => Int)
  episodeRuntime: number;

  @Field()
  isInProduction: boolean;

  @Field(() => [Season])
  seasons: Season[];
}
