import 'reflect-metadata';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Void {
  @Field(() => String, { nullable: true })
  _: string;
}
