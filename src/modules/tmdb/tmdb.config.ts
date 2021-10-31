import { registerAs } from '@nestjs/config';

export const tmdbConfig = registerAs('tmdb', () => ({
  baseURL: process.env.TMDB_BASE_URL,
  apiKey: process.env.TMDB_API_KEY,
}));
