import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpModuleOptions, HttpModuleOptionsFactory } from '../../http';
import { tmdbConfig } from '../tmdb.config';

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
  @Inject(tmdbConfig.KEY)
  private config: ConfigType<typeof tmdbConfig>;

  createHttpOptions(): HttpModuleOptions {
    return {
      baseURL: this.config.baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
    };
  }
}
