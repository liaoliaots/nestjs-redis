import { Redis, Cluster } from 'ioredis';

export type RedisCheckSettings =
    | {
          type: 'redis';
          client: Redis;
          timeout?: number;
          memoryThreshold?: number;
      }
    | {
          type: 'cluster';
          client: Cluster;
      };
