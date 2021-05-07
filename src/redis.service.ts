import { Injectable, Inject } from '@nestjs/common';
import { RedisOptions } from 'ioredis';
import { REDIS_MODULE_OPTIONS } from './redis.constants';

@Injectable()
export class RedisService {
    constructor(@Inject(REDIS_MODULE_OPTIONS) private options: RedisOptions) {}
}
