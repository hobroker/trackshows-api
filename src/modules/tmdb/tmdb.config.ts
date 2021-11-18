import { registerAs } from '@nestjs/config';
import { TMDB_MODULE_ID } from './tmdb.constants';

export const tmdbConfig = registerAs(TMDB_MODULE_ID, () => ({
  api: {
    baseUrl: process.env.TMDB_API_BASE_URL,
    key: process.env.TMDB_API_KEY,
  },
  skipSpecials: process.env.TMDB_SKIP_SPECIALS !== 'false',
}));
