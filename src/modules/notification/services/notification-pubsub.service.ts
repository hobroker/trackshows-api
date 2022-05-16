import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { notificationConfig } from '../notification.config';

@Injectable()
export class NotificationPubsubService implements OnModuleDestroy {
  pubsub: RedisPubSub;

  private topicName = 'notifications';

  constructor(
    @Inject(notificationConfig.KEY)
    private config: ConfigType<typeof notificationConfig>,
  ) {
    this.pubsub = new RedisPubSub({
      connection: {
        host: config.redisHost,
        port: config.redisPort,
      },
    });
  }

  onModuleDestroy() {
    return this.pubsub.close();
  }

  getAsyncIterator() {
    return this.pubsub.asyncIterator(this.topicName);
  }

  publishNotificationsForUser(userId, notificationIds: number[]) {
    return this.pubsub.publish(this.topicName, {
      userId,
      notificationIds,
    });
  }
}
