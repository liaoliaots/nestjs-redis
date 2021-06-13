import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { Redis } from 'ioredis';
import { RedisService } from './redis.service';
import { RedisPingCheckOptions } from './interfaces';
import { promiseTimeout } from '../utils';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
    constructor(private readonly redisService: RedisService) {
        super();
    }

    async pingCheck(key: string, options: RedisPingCheckOptions): Promise<HealthIndicatorResult> {
        let client: Redis;

        try {
            client = this.redisService.getClient(options.clientNamespace);
        } catch (e) {
            const error = e as Error;

            throw new HealthCheckError(error.message, this.getStatus(key, false, { message: error.message }));
        }

        try {
            await (typeof options.timeout === 'number'
                ? promiseTimeout(options.timeout, client.ping())
                : client.ping());
        } catch (e) {
            const error = e as Error;

            throw new HealthCheckError(error.message, this.getStatus(key, false, { message: error.message }));
        }

        return this.getStatus(key, true);
    }
}
