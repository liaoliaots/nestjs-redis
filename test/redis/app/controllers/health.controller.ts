import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheckResult } from '@nestjs/terminus';
import { Redis } from 'ioredis';
import { RedisHealthIndicator } from '@/health';
import { InjectRedis } from '@/.';

@Controller('health')
export class HealthController {
    constructor(
        @InjectRedis() private readonly clientDefault: Redis,
        @InjectRedis('client1') private readonly client1: Redis,
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
