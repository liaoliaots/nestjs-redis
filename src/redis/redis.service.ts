import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENTS } from './redis.constants';
import { RedisClients } from './redis.interface';
import { ClientNamespace } from './redis-module-options.interface';
import { RedisError } from '../errors/redis.error';
import { parseNamespace } from './redis-utils';

@Injectable()
export class RedisService {
    constructor(@Inject(REDIS_CLIENTS) private redisClients: RedisClients) {}

    /**
     * Returns all clients.
     */
    get clients(): RedisClients {
        return this.redisClients;
    }

    /**
     * Gets client via namespace.
     */
    getClient(namespace: ClientNamespace): Redis {
        const client = this.redisClients.get(namespace);

        if (!client) throw new RedisError(`Unable to find the '${parseNamespace(namespace)}' client`);

        return client;
    }
}
