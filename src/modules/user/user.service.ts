import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma';
import { User } from './entities';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return this.prismaService.user.create({ data });
  }

  update(
    id: number,
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> {
    return this.prismaService.user.update({ where: { id }, data });
  }

  findMany(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  findByEmail(email: string): Promise<User> {
    return this.prismaService.user.findFirst({ where: { email } });
  }

  findById(id: number): Promise<User> {
    return this.prismaService.user.findFirst({ where: { id } });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.findById(userId);

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
    await this.prismaService.user.update({
      where: { id: userId },
      data: { currentHashedRefreshToken },
    });
  }

  async removeRefreshToken(userId: number) {
    return this.prismaService.user.update({
      where: { id: userId },
      data: { currentHashedRefreshToken: null },
    });
  }
}
