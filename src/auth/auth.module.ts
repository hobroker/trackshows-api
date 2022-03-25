import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services';
import { UserModule } from '../modules/user/user.module';
import {
  JwtStrategy,
  LocalStrategy,
  JwtRefreshTokenStrategy,
} from './strategies';
import { authConfig } from './auth.config';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    JwtModule.register({}),
    UserModule,
    PassportModule,
  ],
  exports: [AuthService],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
