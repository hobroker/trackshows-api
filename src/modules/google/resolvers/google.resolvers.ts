import 'reflect-metadata';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { User } from '../../user/entities';
import { GoogleService } from '../services';
import { JoinWithGoogleInput } from './input';

@Injectable()
@Resolver(User)
export class GoogleResolver {
  constructor(private readonly googleService: GoogleService) {}

  @Mutation(() => User)
  async joinWithGoogle(
    @Args('input') input: JoinWithGoogleInput,
    @Context() { req }: { req: Request },
  ) {
    const { user, refreshTokenCookie, accessTokenCookie } =
      await this.googleService.authenticate(input.token);

    req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    return user;
  }
}
