import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheckResult } from '@nestjs/terminus';
import { Cluster } from 'ioredis';
import { RedisHealthIndicator } from '@/health';
import { InjectCluster } from '@/index';

@Controller('health')
export class HealthController {
    constructor(
        @InjectCluster('client0') private readonly client0: Cluster,
        @InjectCluster() private readonly clientDefault: Cluster,
        private readonly health: HealthCheckService,
        private readonly redis: RedisHealthIndicator
    ) {}

    @Get()
    healthCheck(): Promise<HealthCheckResult> {
        return this.health.check([
            () => this.redis.checkHealth('client0', { client: this.client0 }),
            () => this.redis.checkHealth('default', { client: this.clientDefault })
        ]);
    }

    @Get('with-disconnected-client')
    healthCheckWithDisconnect(): Promise<HealthCheckResult> {
        return this.health.check([() => this.redis.checkHealth('default', { client: this.clientDefault })]);
    }
}
