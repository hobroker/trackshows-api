import {
  Controller,
  Post,
  ClassSerializerInterceptor,
  UseInterceptors,
  Body,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { GoogleService } from '../services';
import { TokenVerificationDto } from '../dto';

@Controller('google')
@UseInterceptors(ClassSerializerInterceptor)
export class GoogleController {
  constructor(private readonly googleAuthenticationService: GoogleService) {}

  @Post()
  async authenticate(
    @Body() tokenData: TokenVerificationDto,
    @Req() request: Request,
  ) {
    const { user, refreshTokenCookie, accessTokenCookie } =
      await this.googleAuthenticationService.authenticate(tokenData.token);

    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);

    return user;
  }
}
