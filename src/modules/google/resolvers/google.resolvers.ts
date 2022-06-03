import 'reflect-metadata';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { User } from '../../user/entities';
import { GoogleService } from '../services';
import { Void } from '../../../util/void';
import { JoinWithGoogleInput } from './input';

@Injectable()
@Resolver(User)
export class GoogleResolver {
  constructor(private readonly googleService: GoogleService) {}

  @Mutation(() => Void)
  async joinWithGoogle(
    @Args('input') input: JoinWithGoogleInput,
    @Context() { req }: { req: Request },
  ): Promise<Void> {
    const { accessToken, refreshToken } = await this.googleService.authenticate(
      input.token,
    );

    req.res.setHeader('Set-Cookie', [accessToken.cookie, refreshToken.cookie]);

    return {};
  }
}
