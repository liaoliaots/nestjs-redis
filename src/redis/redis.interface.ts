import { Redis } from 'ioredis';
import { ClientNamespace } from './redis-module-options.interface';

/**
 * Interface for redis clients.
 */
export type RedisClients = Map<ClientNamespace, Redis>;
