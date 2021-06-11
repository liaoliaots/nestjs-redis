import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { Redis } from 'ioredis';
import { RedisService } from './redis.service';
import { RedisPingCheckOptions } from './interfaces';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
    constructor(private readonly redisService: RedisService) {
        super();
    }

    async pingCheck(key: string, options: RedisPingCheckOptions): Promise<HealthIndicatorResult> {
        let client: Redis;
        let isHealthy = false;

        try {
            client = this.redisService.getClient(options.clientNamespace);
        } catch (error) {
            throw new HealthCheckError('client not found', this.getStatus(key, isHealthy));
        }

        const pingRes = await client.ping();

        isHealthy = true;

        return this.getStatus(key, isHealthy, { res: pingRes });
    }
}
