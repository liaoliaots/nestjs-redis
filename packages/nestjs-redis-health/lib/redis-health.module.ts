import { Module } from '@nestjs/common';
import { RedisHealthIndicator } from './indicators/redis.health';

/**
 * The RedisHealth module with health checks for redis/cluster.
 *
 * @public
 */
@Module({
  providers: [RedisHealthIndicator],
  exports: [RedisHealthIndicator]
})
export class RedisHealthModule {}
