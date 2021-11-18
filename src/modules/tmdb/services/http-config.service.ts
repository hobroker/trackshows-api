import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpModuleOptions, HttpModuleOptionsFactory } from '../../http';
import { tmdbConfig } from '../tmdb.config';

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
  @Inject(tmdbConfig.KEY)
  private config: ConfigType<typeof tmdbConfig>;

  createHttpOptions(): HttpModuleOptions {
    const { baseUrl, key } = this.config.api;

    return {
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${key}`,
      },
    };
  }
}
