import type { Redis, Cluster } from 'ioredis';

/**
 * The settings for redis/cluster checks.
 *
 * @public
 */
export type RedisCheckSettings =
  | {
      /**
       * Server type. You must specify what Redis server type you use. Possible values are "redis", "cluster". This option is required.
       */
      type: 'redis';

      /**
       * The client which the health check should get executed. This option is required.
       */
      client: Redis;

      /**
       * The amount of time the check should require in `ms`.
       *
       * @defaultValue `1000`
       */
      timeout?: number;

      /**
       * The maximum amount of memory used by redis in `bytes`.
       */
      memoryThreshold?: number;
    }
  | {
      /**
       * Server type. You must specify what Redis server type you use. Possible values are "redis", "cluster". This option is required.
       */
      type: 'cluster';

      /**
       * The client which the health check should get executed. This option is required.
       */
      client: Cluster;
    };
