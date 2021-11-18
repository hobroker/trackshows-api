import { registerAs } from '@nestjs/config';
import { PRISMA_MODULE_ID } from './prisma.constants';

export const prismaConfig = registerAs(PRISMA_MODULE_ID, () => ({
  debug: process.env.PRISMA_LOGS === 'true',
}));
