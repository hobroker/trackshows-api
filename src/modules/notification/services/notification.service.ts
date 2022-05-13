import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class NotificationService {
  constructor(private readonly prismaService: PrismaService) {}

  async getNotifications(userId: number) {
    throw new Error(`Method not implemented. ${userId}`);
  }
}
