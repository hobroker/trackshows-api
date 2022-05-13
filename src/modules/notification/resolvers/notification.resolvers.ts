import 'reflect-metadata';
import { Injectable, UseGuards } from '@nestjs/common';
import { Context, Query, Resolver } from '@nestjs/graphql';
import { Notification } from '../entities';
import { GraphqlJwtAuthGuard } from '../../auth/guards';
import { RequestWithUser } from '../../auth/interfaces';
import { NotificationService } from '../services';

@Injectable()
@Resolver(Notification)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Query(() => [Notification])
  @UseGuards(GraphqlJwtAuthGuard)
  async listNotifications(
    @Context() { req: { user } }: { req: RequestWithUser },
  ) {
    const userId = user.id;

    return this.notificationService.getNotifications(userId);
  }
}
