import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { setupCache } from 'axios-cache-adapter';
import * as redis from 'redis';
import type { RedisClientType } from 'redis';
import { HttpModuleOptions, HttpModuleOptionsFactory } from '../../http';
import { tmdbConfig } from '../tmdb.config';
import { RedisDefaultStore } from '../../http/util/RedisStore';

@Injectable()
export class HttpConfigService
  implements HttpModuleOptionsFactory, OnModuleInit
{
  private readonly logger = new Logger(this.constructor.name);
  private readonly client: RedisClientType;

  constructor(
    @Inject(tmdbConfig.KEY)
    private config: ConfigType<typeof tmdbConfig>,
  ) {
    this.client = redis.createClient({
      url: `redis://${this.config.redisHost}:${this.config.redisPort}`,
    });

    this.client.on('error', (err) =>
      this.logger.error('Redis Client Error', err),
    );
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async createHttpOptions(): Promise<HttpModuleOptions> {
    const { baseUrl, key } = this.config.api;

    const cache = setupCache({
      maxAge: 1000 * 60 * 60 * 24,
      store: new RedisDefaultStore(this.client, {
        excludePrefix: baseUrl,
      }),
    });

    return {
      baseURL: baseUrl,
      adapter: cache.adapter,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${key}`,
      },
    };
  }
}
