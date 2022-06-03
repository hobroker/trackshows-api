import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from '../../user/services';
import { authConfig } from '../auth.config';

interface TokenPayload {
  userId: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(authConfig.KEY)
    private config: ConfigType<typeof authConfig>,

    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request.headers.authorization;
        },
      ]),
      secretOrKey: config.jwtAccessTokenSecret,
    });
  }

  async validate(payload: TokenPayload) {
    return this.userService.findById(payload.userId);
  }
}
