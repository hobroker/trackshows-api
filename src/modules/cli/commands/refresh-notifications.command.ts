import { Command, CommandRunner } from 'nest-commander';
import { WithDuration } from '../util';
import { NotificationSchedulerService } from '../../notification/services';

@Command({
  name: 'refresh-notifications',
  description: 'Refresh notifications for all users',
})
export class RefreshNotificationsCommand implements CommandRunner {
  constructor(
    private readonly notificationSchedulerService: NotificationSchedulerService,
  ) {}

  @WithDuration()
  async run() {
    await this.notificationSchedulerService.refreshNotifications();
  }
}
