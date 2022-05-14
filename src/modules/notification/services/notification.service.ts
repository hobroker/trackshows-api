import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { Notification } from '../entities';

@Injectable()
export class NotificationService {
  constructor(private readonly prismaService: PrismaService) {}

  listNotificationsForUser(userId: number): Promise<Notification[]> {
    return this.prismaService.notification.findMany({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  readNotification(id: number) {
    return this.prismaService.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  readAllNotificationsForUser(userId: number) {
    return this.prismaService.notification.updateMany({
      where: { userId },
      data: { isRead: true },
    });
  }
}
