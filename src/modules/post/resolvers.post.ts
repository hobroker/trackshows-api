import 'reflect-metadata';
import {
  Args,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { Post } from './entities/post';
import { PrismaService } from '../prisma/prisma.service';
import { PostService } from './post.service';

@InputType()
export class PostCreateInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  content: string;
}

@Resolver(Post)
export class PostResolver {
  constructor(@Inject(PostService) private postService: PostService) {}

  @Query(() => Post, { nullable: true })
  postById(@Args('id') id: number) {
    return this.postService.findById(id);
  }

  @Query(() => [Post])
  feed(
    @Args('search', { nullable: true }) search: string,
    @Args('skip', { nullable: true }) skip: number,
    @Args('take', { nullable: true }) take: number,
  ) {
    return this.postService.findMany(search, skip, take);
  }

  @Mutation(() => Post)
  createDraft(
    @Args('data') data: PostCreateInput,
    @Args('authorEmail') authorEmail: string,
  ): Promise<Post> {
    return this.postService.create(data, authorEmail);
  }

  @Mutation(() => Post, { nullable: true })
  async deletePost(@Args('id') id: number): Promise<Post | null> {
    return this.postService.delete(id);
  }
}
