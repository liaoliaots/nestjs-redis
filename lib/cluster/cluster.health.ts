import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { ClusterService } from './cluster.service';
import { ClusterHealthCheckOptions } from './interfaces';
import { RedisError, FAILED_CLUSTER_STATE } from '../errors';

@Injectable()
export class ClusterHealthIndicator extends HealthIndicator {
    constructor(private readonly clusterService: ClusterService) {
        super();
    }

    async isHealthy(key: string, options: ClusterHealthCheckOptions): Promise<HealthIndicatorResult> {
        try {
            const client = this.clusterService.getClient(options.namespace);

            const clusterInfo = (await client.cluster('info')) as string;

            if (!clusterInfo.includes('cluster_state:ok')) throw new RedisError(FAILED_CLUSTER_STATE);

            await client.ping();
        } catch (err) {
            const error = err as Error;

            throw new HealthCheckError(error.message, this.getStatus(key, false, { message: error.message }));
        }

        return this.getStatus(key, true);
    }
}
