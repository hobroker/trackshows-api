import { registerAs } from '@nestjs/config';
import { CLI_MODULE_ID } from './cli.constants';

export const cliConfig = registerAs(CLI_MODULE_ID, () => ({
  logs: process.env.CLI_PRISMA_LOGS === 'true',
}));
