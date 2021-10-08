import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheckResult } from '@nestjs/terminus';
import { Redis } from 'ioredis';
import { RedisHealthIndicator } from '@/health';
import { InjectRedis } from '@/.';

@Controller('health')
export class HealthController {
    constructor(
        @InjectRedis() private readonly defaultClient: Redis,
        @InjectRedis('client1') private readonly client1: Redis,
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
