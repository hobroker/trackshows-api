import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PieItem {
  @Field()
  id: string;

  @Field()
  label: string;

  @Field(() => Int)
  value: number;
}
