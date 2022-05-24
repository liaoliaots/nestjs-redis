import { Redis } from 'ioredis';
import { ClientNamespace } from '@/interfaces';

export * from './redis-module-options.interface';

export type RedisClients = Map<ClientNamespace, Redis>;
