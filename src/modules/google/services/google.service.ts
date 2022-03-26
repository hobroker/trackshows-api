import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Auth, google } from 'googleapis';
import { User } from '../../user/entities';
import { UserService } from '../../user/user.service';
import { googleConfig } from '../google.config';
import { AuthService } from '../../auth';

const { OAuth2 } = google.auth;

@Injectable()
export class GoogleService {
  private readonly oauthClient: Auth.OAuth2Client;

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
    const { email } = await this.oauthClient.getTokenInfo(token);

    const user = await this.userService.findByEmail(email);

    if (!user) {
      return this.registerUser(token, email);
    }
    await this.updateRegisteredUser(token, user);

    return this.handleRegisteredUser(user);
  }

  private async registerUser(token: string, email: string) {
    const userData = await this.getUserData(token);
    const { name, picture: avatar } = userData;

    const user = await this.userService.create({ email, name, avatar });

    return this.handleRegisteredUser(user);
  }

  private async getUserData(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;

    this.oauthClient.setCredentials({
      access_token: token,
    });

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient,
    });

    return userInfoResponse.data;
  }

  private async getCookiesForUser(user: User) {
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

  private async handleRegisteredUser(user: User) {
    const { accessTokenCookie, refreshTokenCookie } =
      await this.getCookiesForUser(user);

    return {
      accessTokenCookie,
      refreshTokenCookie,
      user,
    };
  }

  private async updateRegisteredUser(token: string, user: User) {
    const userData = await this.getUserData(token);
    const { name, picture: avatar } = userData;

    await this.userService.update(user.id, {
      name,
      avatar,
    });
  }
}
