import 'reflect-metadata';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { User } from '../entities';
import { UserService } from '../user.service';
import { UserCreateInput } from './input';
import { GraphqlJwtAuthGuard } from '../../auth/guards/graphql-jwt-auth.guard';

@Resolver(User)
export class UserResolver {
  constructor(@Inject(UserService) private userService: UserService) {}

  @Mutation(() => User)
  async join(@Args('data') data: UserCreateInput): Promise<User> {
    return this.userService.findOrCreate(data);
  }

  @Query(() => [User], { nullable: true })
  @UseGuards(GraphqlJwtAuthGuard)
  async allUsers() {
    return this.userService.findMany();
  }
}
