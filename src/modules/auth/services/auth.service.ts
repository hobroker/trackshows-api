import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserService } from '../../user/user.service';
import { authConfig } from '../auth.config';
import { RegisterDto } from '../dto';
import { TokenPayload } from '../interfaces';

@Injectable()
export class AuthService {
  @Inject(authConfig.KEY)
  private config: ConfigType<typeof authConfig>;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    const createdUser = await this.userService.create({
      ...registrationData,
      password: hashedPassword,
    });

    createdUser.password = undefined;

    return createdUser;
  }

  public getCookieWithJwtAccessToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.config.jwtAccessTokenSecret,
      expiresIn: `${this.config.jwtAccessTokenExirationTime}s`,
    });

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.config.jwtAccessTokenExirationTime}`;
  }

  public getCookieWithJwtRefreshToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.config.jwtRefreshTokenSecret,
      expiresIn: `${this.config.jwtRefreshTokenExirationTime}s`,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.config.jwtRefreshTokenExirationTime}`;

    return {
      cookie,
      token,
    };
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.userService.findByEmail(email);

      await this.verifyPassword(plainTextPassword, user.password);

      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
