import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { User } from './entities/user';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  create(data): Promise<User> {
    return this.prismaService.user.create({
      data: {
        email: data.email,
        name: data.name,
      },
    });
  }

  findMany(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }
}
