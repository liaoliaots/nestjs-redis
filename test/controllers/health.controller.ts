import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheckResult } from '@nestjs/terminus';
import { RedisHealthIndicator, DEFAULT_REDIS_CLIENT } from '../../lib';

@Controller('health')
export class HealthController {
    constructor(private readonly health: HealthCheckService, private readonly redis: RedisHealthIndicator) {}

    @Get()
    healthCheck(): Promise<HealthCheckResult> {
        return this.health.check([
            () => this.redis.pingCheck('client0', { namespace: 'client0', timeout: 1000 }),
            () => this.redis.pingCheck('default', { namespace: DEFAULT_REDIS_CLIENT, timeout: 1000 })
        ]);
    }

    @Get('with-unknown-namespace')
    healthCheckWithUnknownNamespace(): Promise<HealthCheckResult> {
        return this.health.check([() => this.redis.pingCheck('unknown', { namespace: '?' })]);
    }

    @Get('with-disconnected-client')
    healthCheckWithDisconnect(): Promise<HealthCheckResult> {
        return this.health.check([() => this.redis.pingCheck('default', { namespace: DEFAULT_REDIS_CLIENT })]);
    }
}
