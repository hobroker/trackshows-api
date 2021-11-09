import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductionCompany {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  logo: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
