import { Injectable, Scope } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import IORedis, { Redis, Cluster } from 'ioredis';
import { RedisError, CLIENT_NOT_FOUND_FOR_HEALTH, FAILED_CLUSTER_STATE } from '@/errors';

export interface RedisCheckOptions {
    /**
     * The client which the health check should get executed.
     */
    client: Redis | Cluster;
}

@Injectable({ scope: Scope.TRANSIENT })
export class RedisHealthIndicator extends HealthIndicator {
    /**
     * Checks a redis connection.
     *
     * @param key - The key which will be used for the result object
     * @param options - The options for check
     *
     * @example
     * ```
     * const client = new Redis();
     * redisHealthIndicator.check('redis', { client });
     * ```
     *
     * @example
     * ```
     * const client = new Redis.Cluster([]);
     * redisHealthIndicator.check('cluster', { client });
     * ```
     */
    async check(key: string, options: RedisCheckOptions): Promise<HealthIndicatorResult> {
        let isHealthy = false;

        try {
            if (!options.client) throw new RedisError(CLIENT_NOT_FOUND_FOR_HEALTH);

            if (options.client instanceof IORedis) await options.client.ping();

            if (options.client instanceof IORedis.Cluster) {
                const clusterInfo = (await options.client.cluster('info')) as string;

                if (!clusterInfo || !clusterInfo.includes('cluster_state:ok')) {
                    throw new RedisError(FAILED_CLUSTER_STATE);
                }
            }

            isHealthy = true;
        } catch (e) {
            const error = e as Error;

            throw new HealthCheckError(error.message, this.getStatus(key, isHealthy, { message: error.message }));
        }

        return this.getStatus(key, isHealthy);
    }
}
