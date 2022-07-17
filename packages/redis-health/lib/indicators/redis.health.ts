import { Injectable, Scope } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { FAILED_CLUSTER_STATE, CANNOT_BE_READ, ABNORMALLY_MEMORY_USAGE, INVALID_TYPE } from '@health/messages';
import { promiseTimeout, removeLineBreaks, parseUsedMemory, isNullish } from '@health/utils';
import { RedisCheckSettings } from './redis-check-settings.interface';

/**
 * The RedisHealthIndicator is used for health checks related to redis.
 *
 * @public
 */
@Injectable({ scope: Scope.TRANSIENT })
export class RedisHealthIndicator extends HealthIndicator {
  /**
   * Checks a redis/cluster connection.
   *
   * @param key - The key which will be used for the result object
   * @param options - The extra options for check
   */
  async checkHealth(key: string, options: RedisCheckSettings): Promise<HealthIndicatorResult> {
    const { type, client } = options;
    let isHealthy = false;

    if (type !== 'redis' && type !== 'cluster') throw new Error(INVALID_TYPE);

    try {
      if (type === 'redis') {
        await promiseTimeout(options.timeout ?? 1000, client.ping());
        if (!isNullish(options.memoryThreshold)) {
          const info = await client.info('memory');
          if (parseUsedMemory(removeLineBreaks(info)) > options.memoryThreshold) {
            throw new Error(ABNORMALLY_MEMORY_USAGE);
          }
        }
      } else {
        const clusterInfo = await client.cluster('INFO');
        if (typeof clusterInfo === 'string') {
          if (!clusterInfo.includes('cluster_state:ok')) throw new Error(FAILED_CLUSTER_STATE);
        } else throw new Error(CANNOT_BE_READ);
      }

      isHealthy = true;
    } catch (e) {
      const { message } = e as Error;
      throw new HealthCheckError(message, this.getStatus(key, isHealthy, { message }));
    }

    return this.getStatus(key, isHealthy);
  }
}
