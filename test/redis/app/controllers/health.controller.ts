import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheckResult } from '@nestjs/terminus';
import { Redis } from 'ioredis';
import { RedisHealthIndicator } from '@/health';
import { InjectRedis } from '@/index';

@Controller('health')
export class HealthController {
    constructor(
        @InjectRedis('client0') private readonly client0: Redis,
        @InjectRedis() private readonly clientDefault: Redis,
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
