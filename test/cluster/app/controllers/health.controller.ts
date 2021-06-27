import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheckResult } from '@nestjs/terminus';
import { ClusterHealthIndicator, DEFAULT_CLUSTER_CLIENT } from '../../../../lib';

@Controller('health')
export class HealthController {
    constructor(private readonly health: HealthCheckService, private readonly cluster: ClusterHealthIndicator) {}

    @Get()
    healthCheck(): Promise<HealthCheckResult> {
        return this.health.check([
            () => this.cluster.isHealthy('client0', { namespace: 'client0' }),
            () => this.cluster.isHealthy('default', { namespace: DEFAULT_CLUSTER_CLIENT })
        ]);
    }

    @Get('with-unknown-namespace')
    healthCheckWithUnknownNamespace(): Promise<HealthCheckResult> {
        return this.health.check([() => this.cluster.isHealthy('unknown', { namespace: '?' })]);
    }

    @Get('with-disconnected-client')
    healthCheckWithDisconnect(): Promise<HealthCheckResult> {
        return this.health.check([() => this.cluster.isHealthy('default', { namespace: DEFAULT_CLUSTER_CLIENT })]);
    }
}
