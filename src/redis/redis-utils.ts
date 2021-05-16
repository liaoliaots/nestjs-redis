import IORedis, { Redis } from 'ioredis';
import { RedisModuleOptions } from './redis-module-options.interface';
import { isNotEmpty } from '../utils';

/**
 * Creates redis client
 *
 * @param options - The options of redis module
 */
export const createClient = (options: RedisModuleOptions): Redis => {
    const { url, onClientCreated, redisOptions } = options;

    const client = isNotEmpty(url) ? new IORedis(url) : new IORedis(redisOptions);
    if (onClientCreated) onClientCreated(client);

    return client;
};
