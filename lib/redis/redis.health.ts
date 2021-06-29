import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { RedisService } from './redis.service';
import { RedisHealthCheckOptions } from './interfaces';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
    constructor(private readonly redisService: RedisService) {
        super();
    }

    async isHealthy(key: string, options: RedisHealthCheckOptions): Promise<HealthIndicatorResult> {
        try {
            const client = this.redisService.getClient(options.namespace);

            await client.ping();
        } catch (err) {
            const error = err as Error;

            throw new HealthCheckError(error.message, this.getStatus(key, false, { message: error.message }));
        }

        return this.getStatus(key, true);
    }
}
