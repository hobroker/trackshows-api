import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Gender } from './gender';

@ObjectType()
export class Person {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => String, { defaultValue: '' })
  description: string;

  @Field({ nullable: true })
  image: string;

  @Field(() => Date, { nullable: true })
  birthday: Date;

  @Field(() => Date, { nullable: true })
  deathday: Date;

  @Field(() => Gender)
  gender: Gender;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
