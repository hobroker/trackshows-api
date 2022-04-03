import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({ data });
  }

  update(userId: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prismaService.user.update({ where: { id: userId }, data });
  }

  findMany(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  findByEmail(email: string): Promise<User> {
    return this.prismaService.user.findFirst({ where: { email } });
  }

  findById(userId: number): Promise<User> {
    return this.prismaService.user.findFirst({ where: { id: userId } });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.findById(userId);

    if (!user) {
      return null;
    }

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }

    return null;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    return this.update(userId, { currentHashedRefreshToken });
  }

  async removeRefreshToken(userId: number) {
    return this.update(userId, { currentHashedRefreshToken: null });
  }
}
