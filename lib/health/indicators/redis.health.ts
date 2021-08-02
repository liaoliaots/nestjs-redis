import { Injectable, Scope } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import IORedis, { Redis, Cluster } from 'ioredis';
import { RedisError, CLIENT_NOT_FOUND_FOR_HEALTH, FAILED_CLUSTER_STATE, CANNOT_BE_READ } from '@/errors';

export interface RedisCheckOptions {
    /**
     * The client which the health check should get executed.
     */
    client: Redis | Cluster;
}

@Injectable({ scope: Scope.TRANSIENT })
export class RedisHealthIndicator extends HealthIndicator {
    /**
     * Checks a connection.
     *
     * @param key - The key which will be used for the result object
     * @param options - The options for check
     *
     * @example
     * ```
     * const client = new IORedis({ host: 'localhost', port: 6380 });
     * redisHealthIndicator.checkHealth('redis', { client });
     * ```
     *
     * @example
     * ```
     * const client = new IORedis.Cluster([{ host: 'localhost', port: 16380 }]);
     * redisHealthIndicator.checkHealth('cluster', { client });
     * ```
     */
    async checkHealth(key: string, options: RedisCheckOptions): Promise<HealthIndicatorResult> {
        let isHealthy = false;

        try {
            if (!options.client) throw new RedisError(CLIENT_NOT_FOUND_FOR_HEALTH);

            // * is redis
            if (options.client instanceof IORedis) {
                await options.client.ping();
            }
            // * is cluster
            else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const clusterInfo = await options.client.cluster('info');

                if (clusterInfo && typeof clusterInfo === 'string') {
                    if (!clusterInfo.includes('cluster_state:ok')) throw new RedisError(FAILED_CLUSTER_STATE);
                } else {
                    throw new RedisError(CANNOT_BE_READ);
                }
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
