import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ShowDetails {
  @Field(() => Int)
  episodeRuntime: number;

  @Field()
  isInProduction: boolean;
}
