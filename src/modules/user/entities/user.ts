import 'reflect-metadata';
import { Field, HideField, Int, ObjectType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  @IsEmail()
  email: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  avatar?: string;

  @HideField()
  password?: string;

  @HideField()
  public currentHashedRefreshToken?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
