import { Redis } from 'ioredis';
import { ClientName } from './redis-module-options.interface';

/**
 * Interface for redis clients.
 */
export type RedisClients = Map<ClientName, Redis>;
