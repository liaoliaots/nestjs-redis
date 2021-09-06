import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheckResult } from '@nestjs/terminus';
import { Cluster } from 'ioredis';
import { RedisHealthIndicator } from '@/health';
import { InjectCluster } from '@/.';

@Controller('health')
export class HealthController {
    constructor(
        @InjectCluster() private readonly clientDefault: Cluster,
        @InjectCluster('client1') private readonly client1: Cluster,
        private readonly healthCheckService: HealthCheckService,
        private readonly redisHealthIndicator: RedisHealthIndicator
    ) {}

    @Get()
    async healthCheck(): Promise<HealthCheckResult> {
        return await this.healthCheckService.check([
            () => this.redisHealthIndicator.checkHealth('clientDefault', { client: this.clientDefault }),
            () => this.redisHealthIndicator.checkHealth('client1', { client: this.client1 })
        ]);
    }
}
