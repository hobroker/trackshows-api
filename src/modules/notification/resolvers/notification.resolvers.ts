import 'reflect-metadata';
import { Injectable, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Notification } from '../entities';
import { GraphqlJwtAuthGuard } from '../../auth/guards';
import { RequestWithUser } from '../../auth/interfaces';
import { NotificationService } from '../services';
import { Episode } from '../../show/entities/episode';
import { EpisodeService } from '../../watchlist/services';
import { Void } from '../../../util/void';
import { ReadNotificationInput } from './inputs';

@Injectable()
@Resolver(Notification)
export class NotificationResolver {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly episodeService: EpisodeService,
  ) {}

  @ResolveField()
  async episode(@Parent() notification: Notification): Promise<Episode> {
    return this.episodeService.findEpisodeByExternalId(notification.episodeId);
  }

  @Query(() => [Notification])
  @UseGuards(GraphqlJwtAuthGuard)
  async listNotifications(
    @Context() { req: { user } }: { req: RequestWithUser },
  ) {
    const userId = user.id;

    return this.notificationService.listNotificationsForUser(userId);
  }

  @Mutation(() => Void)
  @UseGuards(GraphqlJwtAuthGuard)
  async readNotification(
    @Args('input') { notificationId }: ReadNotificationInput,
  ) {
    return this.notificationService.readNotification(notificationId);
  }

  // @Mutation(() => [Notification])
  // @UseGuards(GraphqlJwtAuthGuard)
  // async readAllNotifications(
  //   @Args('input') { notificationId }: ReadNotificationInput,
  //   @Context() { req: { user } }: { req: RequestWithUser },
  // ) {
  //   return this.notificationService.readNotification(notificationId);
  // }
}
