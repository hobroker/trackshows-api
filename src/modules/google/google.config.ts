import { registerAs } from '@nestjs/config';
import { GOOGLE_MODULE_ID } from './google.constants';

export const googleConfig = registerAs(GOOGLE_MODULE_ID, () => ({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
}));
