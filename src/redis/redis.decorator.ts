import { Inject } from '@nestjs/common';
import { ClientNamespace } from './redis-module-options.interface';
import { DEFAULT_REDIS_CLIENT } from './redis.constants';

/**
 * The list of namespaces.
 */
export const namespaces: ClientNamespace[] = [];

/**
 * Injects redis client via namespace.
 */
export const RedisClient = (namespace: ClientNamespace = DEFAULT_REDIS_CLIENT): ReturnType<typeof Inject> =>
    Inject(namespace);
