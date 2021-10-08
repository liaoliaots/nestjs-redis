import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheckResult } from '@nestjs/terminus';
import { Cluster } from 'ioredis';
import { RedisHealthIndicator } from '@/health';
import { InjectCluster } from '@/.';

@Controller('health')
export class HealthController {
    constructor(
        @InjectCluster() private readonly defaultClient: Cluster,
        @InjectCluster('client1') private readonly client1: Cluster,
        private readonly health: HealthCheckService,
        private readonly redis: RedisHealthIndicator
    ) {}

    @Get()
    async healthCheck(): Promise<HealthCheckResult> {
        return await this.health.check([
            () => this.redis.checkHealth('default', { client: this.defaultClient }),
            () => this.redis.checkHealth('client1', { client: this.client1 })
        ]);
    }
}
