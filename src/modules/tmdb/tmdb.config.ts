import { registerAs } from '@nestjs/config';
import { TMDB_MODULE_ID } from './tmdb.constants';

export const tmdbConfig = registerAs(TMDB_MODULE_ID, () => ({
  baseURL: process.env.TMDB_BASE_URL,
  apiKey: process.env.TMDB_API_KEY,
}));
