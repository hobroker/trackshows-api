import { registerAs } from '@nestjs/config';
import { AUTH_MODULE_ID } from './auth.constants';

export const authConfig = registerAs(AUTH_MODULE_ID, () => ({
  jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwtAccessTokenExirationTime: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  jwtRefreshTokenExirationTime: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
}));
