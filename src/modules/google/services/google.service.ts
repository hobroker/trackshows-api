import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { google, Auth } from 'googleapis';
import { User } from '../../user/entities';
import { UserService } from '../../user/user.service';
import { googleConfig } from '../google.config';
import { AuthService } from '../../../auth';

const { OAuth2 } = google.auth;

@Injectable()
export class GoogleService {
  oauthClient: Auth.OAuth2Client;

  constructor(
    @Inject(googleConfig.KEY)
    private config: ConfigType<typeof googleConfig>,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    const { clientId, clientSecret } = this.config;

    this.oauthClient = new OAuth2(clientId, clientSecret);
  }

  async authenticate(token: string) {
    const tokenInfo = await this.oauthClient.getTokenInfo(token);
    const email = tokenInfo.email;

    const user = await this.userService.findByEmail(email);

    if (!user) {
      return this.registerUser(token, email);
    }

    return this.handleRegisteredUser(user);
  }

  async registerUser(token: string, email: string) {
    const userData = await this.getUserData(token);
    const username = userData.name;

    const user = await this.userService.create({ email, username });

    return this.handleRegisteredUser(user);
  }

  async getUserData(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;

    this.oauthClient.setCredentials({
      access_token: token,
    });

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient,
    });

    return userInfoResponse.data;
  }

  async getCookiesForUser(user: User) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authService.getCookieWithJwtRefreshToken(user.id);

    await this.userService.setCurrentRefreshToken(refreshToken, user.id);

    return {
      accessTokenCookie,
      refreshTokenCookie,
    };
  }

  async handleRegisteredUser(user: User) {
    const { accessTokenCookie, refreshTokenCookie } =
      await this.getCookiesForUser(user);

    return {
      accessTokenCookie,
      refreshTokenCookie,
      user,
    };
  }
}
