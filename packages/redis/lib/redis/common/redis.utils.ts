import { Redis } from 'ioredis';
import { RedisClientOptions, RedisModuleOptions } from '../interfaces';
import { Namespace } from '@/interfaces';
import { READY_LOG, ERROR_LOG } from '@/messages';
import { logger } from '../redis-logger';
import { parseNamespace, get } from '@/utils';
import { DEFAULT_REDIS, NAMESPACE_KEY } from '../redis.constants';

export const createClient = (
  { namespace, url, path, onClientCreated, ...redisOptions }: RedisClientOptions,
  { readyLog, errorLog }: RedisModuleOptions
): Redis => {
  let client: Redis;
  if (url) client = new Redis(url, redisOptions);
  else if (path) client = new Redis(path, redisOptions);
  else client = new Redis(redisOptions);
  Reflect.defineProperty(client, NAMESPACE_KEY, {
    value: namespace ?? DEFAULT_REDIS,
    writable: false,
    enumerable: false,
    configurable: false
  });
  if (readyLog) {
    client.on('ready', () => {
      logger.log(READY_LOG(parseNamespace(get<Namespace>(client, NAMESPACE_KEY))));
    });
  }
  if (errorLog) {
    client.on('error', (error: Error) => {
      logger.error(ERROR_LOG(parseNamespace(get<Namespace>(client, NAMESPACE_KEY)), error.message), error.stack);
    });
  }
  if (onClientCreated) onClientCreated(client);
  return client;
};
