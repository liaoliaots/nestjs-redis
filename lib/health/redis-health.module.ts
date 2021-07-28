import { Module } from '@nestjs/common';
import { RedisHealthIndicator } from './indicators/redis.health';

@Module({
    providers: [RedisHealthIndicator],
    exports: [RedisHealthIndicator]
})
export class RedisHealthModule {}
