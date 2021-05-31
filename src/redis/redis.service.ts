import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENTS } from './redis.constants';
import { RedisClients } from './redis.interface';
import { ClientNamespace } from './redis-module-options.interface';
import { RedisError } from '../errors/redis.error';

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
     * Parses client name.
     */
    private parseName(name: ClientNamespace): string {
        if (typeof name === 'string') return name;
        if (typeof name === 'symbol') return name.toString();

        return 'unknown';
    }

    /**
     * Gets client via client name.
     */
    getClient(name: ClientNamespace): Redis {
        const client = this.redisClients.get(name);

        if (!client) throw new RedisError(`Unable to find the '${this.parseName(name)}' client`);

        return client;
    }
}
