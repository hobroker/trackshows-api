import { Command, CommandRunner } from 'nest-commander';
import { Logger } from '@nestjs/common';
import { WithDuration } from '../util';
import { NotificationSchedulerService } from '../../notification/services';

@Command({
  name: 'refresh-notifications',
  description: 'Refresh notifications for all users',
})
export class RefreshNotificationsCommand implements CommandRunner {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly notificationSchedulerService: NotificationSchedulerService,
  ) {}

  @WithDuration()
  async run() {
    await this.notificationSchedulerService.refreshNotifications();
  }
}
