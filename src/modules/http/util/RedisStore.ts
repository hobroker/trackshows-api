import type { RedisClientType } from 'redis';

interface Options {
  excludePrefix?: string;
}

export class RedisDefaultStore {
  private readonly client: RedisClientType;
  private readonly maxScanCount = 1000;
  private readonly excludePrefix: string;

  constructor(client, options: Options = {}) {
    this.client = client;
    this.excludePrefix = options.excludePrefix || '';
  }

  calculateTTL(value) {
    const now = Date.now();

    if (value.expires && value.expires > now) {
      return value.expires - now;
    }

    return -1;
  }

  transformKey(key) {
    return 'axios-cache_' + key.replace(this.excludePrefix, '');
  }

  async getItem(key) {
    const item = (await this.client.get(this.transformKey(key))) || null;

    return JSON.parse(item);
  }

  async setItem(key, value) {
    const computedKey = this.transformKey(key);

    const ttl = this.calculateTTL(value);

    if (ttl > 0) {
      await this.client.set(computedKey, JSON.stringify(value));
      await this.client.expire(computedKey, ttl);
    }

    return value;
  }

  async removeItem(key) {
    await this.client.del(this.transformKey(key));
  }

  async scan(operation) {
    let cursor = '0';

    do {
      const reply = await this.client.scanIterator({
        TYPE: 'string',
        MATCH: this.transformKey('*'),
        COUNT: this.maxScanCount,
      });

      cursor = reply[0];

      await operation(reply[1]);
    } while (cursor !== '0');
  }

  async clear() {
    await this.scan((keys) => this.client.del(keys));
  }

  async length() {
    let length = 0;

    await this.scan((keys) => {
      length += keys.length;
    });

    return length;
  }

  async iterate(fn) {
    async function runFunction(key) {
      const item = (await this.getAsync(key)) || null;

      const value = JSON.parse(item);

      return fn(value, key);
    }

    await this.scan((keys) => Promise.all(keys.map(runFunction.bind(this))));

    return Promise.resolve([]);
  }
}
