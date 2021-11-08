import { registerAs } from '@nestjs/config';
import { CONSOLE_MODULE_ID } from './console.constants';

export const consoleConfig = registerAs(CONSOLE_MODULE_ID, () => ({
  debug: process.env.CONSOLE_DEBUG_PRISMA === 'true',
}));
