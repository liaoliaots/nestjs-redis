import type { Redis } from 'ioredis';
import { Namespace } from '@/interfaces';

export type RedisClients = Map<Namespace, Redis>;
