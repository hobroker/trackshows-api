import 'reflect-metadata';
import { Context, Query, Resolver } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { User } from '../entities';
import { UserService } from '../user.service';
import { GraphqlJwtAuthGuard } from '../../auth/guards';
import { RequestWithUser } from '../../auth/interfaces';

@Resolver(User)
export class UserResolver {
  constructor(@Inject(UserService) private userService: UserService) {}

  @Query(() => User)
  @UseGuards(GraphqlJwtAuthGuard)
  async allUsers() {
    return this.userService.findMany();
  }

  @Query(() => User)
  @UseGuards(GraphqlJwtAuthGuard)
  async me(@Context() context: { req: RequestWithUser }) {
    return context.req.user;
  }
}
