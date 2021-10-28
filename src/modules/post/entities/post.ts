import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/entities/user';

@ObjectType()
export class Post {
  @Field(() => Int)
  id: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field()
  title: string;

  @Field(() => String, { nullable: true })
  content: string | null;

  @Field(() => Boolean, { nullable: true })
  published?: boolean | null;

  @Field(() => Int)
  viewCount: number;

  @Field(() => User, { nullable: true })
  author?: User | null;
}
