import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Season {
  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field()
  tallImage: string;

  @Field(() => Int)
  number: number;
}
