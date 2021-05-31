import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import is from '@sindresorhus/is';
import { REDIS_CLIENTS } from './redis.constants';
import { RedisClients } from './redis.interface';
import { ClientNamespace } from './redis-module-options.interface';
import { RedisError } from '../errors/redis.error';

@Injectable()
export class RedisService {
    constructor(@Inject(REDIS_CLIENTS) private redisClients: RedisClients) {}

    getClient(name: ClientNamespace): Redis {
        const client = this.redisClients.get(name);

        if (!client) throw new RedisError(`Unable to find the ${is.string(name) ? name : name.toString()} client.`);

        return client;
    }
}
