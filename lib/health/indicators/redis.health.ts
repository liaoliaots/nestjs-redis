import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import IORedis, { Redis, Cluster } from 'ioredis';
import { RedisError } from 'redis-errors';
import { CLIENT_NOT_FOUND_FOR_HEALTH, FAILED_CLUSTER_STATE, CANNOT_BE_READ } from '@/messages';

export interface RedisCheckOptions {
    /**
     * The client which the health check should get executed.
     */
    client: Redis | Cluster;
}

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
    /**
     * Checks a redis/cluster connection.
     *
     * @param key - The key which will be used for the result object
     * @param options - The options for check
     *
     * @example
     * ```
     * import IORedis from 'ioredis';
     *
     * const client = new IORedis({ host: '127.0.0.1', port: 6380 });
     * indicator.checkHealth('redis', { client });
     * ```
     *
     * @example
     * ```
     * import IORedis from 'ioredis';
     *
     * const client = new IORedis.Cluster([{ host: '127.0.0.1', port: 16380 }]);
     * indicator.checkHealth('cluster', { client });
     * ```
     */
    async checkHealth(key: string, options: RedisCheckOptions): Promise<HealthIndicatorResult> {
        let isHealthy = false;

        try {
            if (!options.client) throw new RedisError(CLIENT_NOT_FOUND_FOR_HEALTH);

            // * is redis
            if (options.client instanceof IORedis) await options.client.ping();
            // * is cluster
            else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const clusterInfo = await options.client.cluster('info');

                if (clusterInfo && typeof clusterInfo === 'string') {
                    if (!clusterInfo.includes('cluster_state:ok')) throw new RedisError(FAILED_CLUSTER_STATE);
                } else throw new RedisError(CANNOT_BE_READ);
            }

            isHealthy = true;
        } catch (error) {
            if (error instanceof Error) {
                throw new HealthCheckError(error.message, this.getStatus(key, isHealthy, { message: error.message }));
            }
        }

        return this.getStatus(key, isHealthy);
    }
}
