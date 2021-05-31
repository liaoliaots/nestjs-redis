import IORedis, { Redis } from 'ioredis';
import { RedisModuleOptions } from './redis-module-options.interface';

/**
 * Creates redis client.
 */
export const createClient = (options: RedisModuleOptions): Redis => {
    const { url, ...redisOptions } = options;

    const client = url ? new IORedis(url, redisOptions) : new IORedis(options);

    return client;
};
