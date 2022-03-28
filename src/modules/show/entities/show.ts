import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Status } from './status';
import { Keyword } from './keyword';
import { Genre } from './genre';
import { Season } from './season';
import { ProductionCompany } from './production-company';

@ObjectType()
export class Show {
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

  @Field(() => Int)
  episodeRuntime: number;

  @Field()
  isInProduction: boolean;

  @Field(() => Status)
  status: Status;

  @Field(() => [Genre])
  genres: [Genre];

  @Field(() => [Keyword])
  keywords: [Keyword];

  @Field(() => [Season])
  seasons: [Season];

  @Field(() => [ProductionCompany])
  productionCompanies: [ProductionCompany];
}
