import 'reflect-metadata';
import { Context, Query } from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { User } from '../entities';
import { GraphqlJwtAuthGuard } from '../../auth/guards';
import { RequestWithUser } from '../../auth/interfaces';

@Injectable()
export class UserResolver {
  @Query(() => User)
  @UseGuards(GraphqlJwtAuthGuard)
  async me(@Context() context: { req: RequestWithUser }) {
    return context.req.user;
  }
}
