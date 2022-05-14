import { GooglePubSub } from '@axelspringer/graphql-google-pubsub';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { googleConfig } from '../../google/google.config';

@Injectable()
export class NotificationPubsubService {
  pubsub: GooglePubSub;
  private topicName = 'notifications';

  constructor(
    @Inject(googleConfig.KEY)
    private config: ConfigType<typeof googleConfig>,
  ) {
    this.pubsub = new GooglePubSub({
      projectId: config.projectId,
    });
  }

  getAsyncIterator() {
    return this.pubsub.asyncIterator(this.topicName);
  }

  publishNotificationsForUser(userId, notificationIds: number[]) {
    this.pubsub.publish(this.topicName, {
      userId,
      notificationIds,
    });
  }
}
