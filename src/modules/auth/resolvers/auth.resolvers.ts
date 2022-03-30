import 'reflect-metadata';
import { Context, Mutation } from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { AuthService } from '../services';
import { UserService } from '../../user/services/user.service';
import { RequestWithUser } from '../interfaces';
import { GraphqlJwtAuthGuard, GraphqlJwtRefreshGuard } from '../guards';
import { Void } from '../../../util/void';
import { User } from '../../user/entities';

@Injectable()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => Void)
  @UseGuards(GraphqlJwtAuthGuard)
  async logout(@Context() { req }: { req: RequestWithUser }) {
    await this.userService.removeRefreshToken(req.user.id);
    req.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());

    return {};
  }

  @Mutation(() => User)
  @UseGuards(GraphqlJwtRefreshGuard)
  async refresh(@Context() { req }: { req: RequestWithUser }) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      req.user.id,
    );

    req.res.setHeader('Set-Cookie', accessTokenCookie);

    return req.user;
  }
}
