import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { Post } from '../../post/entities/post';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field()
  @IsEmail()
  email: string;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => [Post], { nullable: true })
  posts?: [Post] | null;
}
