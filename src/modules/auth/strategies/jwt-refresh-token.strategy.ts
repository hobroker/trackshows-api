import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from '../../user/user.service';
import { TokenPayload } from '../interfaces';
import { REFRESH_COOKIE } from '../auth.constants';
import { authConfig } from '../auth.config';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    @Inject(authConfig.KEY)
    private config: ConfigType<typeof authConfig>,

    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.[REFRESH_COOKIE],
      ]),
      secretOrKey: config.jwtRefreshTokenSecret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const refreshToken = request.cookies?.Refresh;

    return this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.userId,
    );
  }
}
