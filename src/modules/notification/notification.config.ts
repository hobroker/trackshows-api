import { registerAs } from '@nestjs/config';
import { NOTIFICATION_MODULE_ID } from './notification.constants';

export const notificationConfig = registerAs(NOTIFICATION_MODULE_ID, () => ({
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
}));
