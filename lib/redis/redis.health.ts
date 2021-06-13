import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { RedisService } from './redis.service';
import { RedisPingCheckOptions } from './interfaces';
import { promiseTimeout } from '../utils';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
    constructor(private readonly redisService: RedisService) {
        super();
    }

    async pingCheck(key: string, options: RedisPingCheckOptions): Promise<HealthIndicatorResult> {
        const shouldUseTimeout = (value?: number): value is number => typeof value === 'number' && !Number.isNaN(value);

        try {
            const client = this.redisService.getClient(options.namespace);

            await (shouldUseTimeout(options.timeout) ? promiseTimeout(options.timeout, client.ping()) : client.ping());
        } catch (e) {
            const error = e as Error;

            throw new HealthCheckError(error.message, this.getStatus(key, false, { message: error.message }));
        }

        return this.getStatus(key, true);
    }
}
