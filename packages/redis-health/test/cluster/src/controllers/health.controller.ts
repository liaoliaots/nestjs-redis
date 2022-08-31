import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheckResult } from '@nestjs/terminus';
import { Cluster } from 'ioredis';
import { RedisHealthIndicator } from '@health/.';
import { InjectCluster } from '@/.';

@Controller('health')
export class HealthController {
  constructor(
    @InjectCluster() private readonly client0: Cluster,
    @InjectCluster('client1') private readonly client1: Cluster,
    private readonly health: HealthCheckService,
    private readonly redis: RedisHealthIndicator
  ) {}

  @Get()
  async healthCheck(): Promise<HealthCheckResult> {
    await this.client0.ping();
    await this.client1.ping();
    return await this.health.check([
      () => this.redis.checkHealth('default', { client: this.client0, type: 'cluster' }),
      () => this.redis.checkHealth('client1', { client: this.client1, type: 'cluster' })
    ]);
  }
}
