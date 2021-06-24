import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { ClusterService } from './cluster.service';
import { ClusterPingCheckOptions } from './interfaces';
import { promiseTimeout } from '../utils';

@Injectable()
export class ClusterHealthIndicator extends HealthIndicator {
    constructor(private readonly clusterService: ClusterService) {
        super();
    }

    async pingCheck(key: string, options: ClusterPingCheckOptions): Promise<HealthIndicatorResult> {
        const shouldUseTimeout = (value?: unknown): value is number =>
            typeof value === 'number' && !Number.isNaN(value);

        try {
            const client = this.clusterService.getClient(options.namespace);

            await (shouldUseTimeout(options.timeout) ? promiseTimeout(options.timeout, client.ping()) : client.ping());
        } catch (e) {
            const error = e as Error;

            throw new HealthCheckError(error.message, this.getStatus(key, false, { message: error.message }));
        }

        return this.getStatus(key, true);
    }
}
