import { registerAs } from '@nestjs/config';

export const prismaConfig = registerAs('prisma', () => ({
  debug: process.env.DEBUG_PRISMA && process.env.DEBUG_PRISMA === 'true',
}));
