import { Redis, Cluster } from 'ioredis';

export type RedisCheckSettings =
    | {
          /**
           * Server type. You must specify what Redis server type you use. Possible values are "redis", "cluster". This option is required.
           */
          type: 'redis';

          /**
           * The client which the health check should get executed.
           */
          client: Redis;

          /**
           * The amount of time the check should require in ms.
           * Default value is 1000 which is equivalent to 1 second.
           */
          timeout?: number;

          /**
           * The maximum amount of memory that the Redis server expects to use in bytes.
           */
          memoryThreshold?: number;
      }
    | {
          /**
           * Server type. You must specify what Redis server type you use. Possible values are "redis", "cluster". This option is required.
           */
          type: 'cluster';

          /**
           * The client which the health check should get executed.
           */
          client: Cluster;
      };
