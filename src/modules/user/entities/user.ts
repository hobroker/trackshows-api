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
  username: string;

  @HideField()
  @Field(() => String, { nullable: true })
  password?: string;

  @HideField()
  @Field({ nullable: true })
  public currentHashedRefreshToken?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
