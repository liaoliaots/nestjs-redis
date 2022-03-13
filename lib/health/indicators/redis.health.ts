import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import {
    FAILED_CLUSTER_STATE,
    CANNOT_BE_READ,
    MISSING_CLIENT,
    NOT_RESPONSIVE,
    ABNORMALLY_MEMORY_USAGE,
    MISSING_TYPE
} from '@/messages';
import { isError, promiseTimeout, removeLineBreaks, parseUsedMemory, isNullish } from '@/utils';
import { RedisCheckSettings } from './redis-check-settings.interface';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
    /**
     * Checks a redis/cluster client.
     *
     * @param key - The key which will be used for the result object
     * @param options - The extra options for check
     *
     * @example
     * ```
     * import IORedis from 'ioredis';
     *
     * const client = new IORedis({ host: 'localhost', port: 6380 });
     * indicator.checkHealth('redis', { type: 'redis', client });
     * ```
     *
     * @example
     * ```
     * import IORedis from 'ioredis';
     *
     * const client = new IORedis.Cluster([{ host: 'localhost', port: 16380 }]);
     * indicator.checkHealth('cluster', { type: 'cluster', client });
     * ```
     */
    async checkHealth(key: string, options: RedisCheckSettings): Promise<HealthIndicatorResult> {
        const { type } = options;
        let isHealthy = false;

        try {
            if (!type) throw new Error(MISSING_TYPE);
            if (!options.client) throw new Error(MISSING_CLIENT);

            if (type === 'redis') {
                const pong = await promiseTimeout(options.timeout ?? 1000, options.client.ping());
                if (pong !== 'PONG') throw new Error(NOT_RESPONSIVE);

                if (!isNullish(options.memoryThreshold)) {
                    const info = await options.client.info('memory');
                    if (parseUsedMemory(removeLineBreaks(info)) > options.memoryThreshold) {
                        throw new Error(ABNORMALLY_MEMORY_USAGE);
                    }
                }
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const clusterInfo = await options.client.cluster('info');

                if (clusterInfo && typeof clusterInfo === 'string') {
                    if (!clusterInfo.includes('cluster_state:ok')) throw new Error(FAILED_CLUSTER_STATE);
                } else {
                    throw new Error(CANNOT_BE_READ);
                }
            }

            isHealthy = true;
        } catch (error) {
            if (isError(error)) {
                throw new HealthCheckError(error.message, this.getStatus(key, isHealthy, { message: error.message }));
            }
        }

        return this.getStatus(key, isHealthy);
    }
}
