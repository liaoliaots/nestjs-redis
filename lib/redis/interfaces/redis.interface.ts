import { Redis } from 'ioredis';
import { ClientNamespace } from '@/interfaces';

export type RedisClients = Map<ClientNamespace, Redis>;
