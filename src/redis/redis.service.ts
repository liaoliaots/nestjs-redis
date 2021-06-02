import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENTS } from './redis.constants';
import { RedisClients, RedisClientsService } from './redis.interface';
import { ClientNamespace } from './redis-module-options.interface';
import { RedisError } from '../errors/redis.error';
import { parseNamespace } from './redis-utils';
import { DEFAULT_REDIS_CLIENT } from './redis.constants';

@Injectable()
export class RedisService implements RedisClientsService {
    constructor(@Inject(REDIS_CLIENTS) private readonly redisClients: RedisClients) {}

    get clients(): ReadonlyMap<ClientNamespace, Redis> {
        return this.redisClients;
    }

    getClient(namespace: ClientNamespace = DEFAULT_REDIS_CLIENT): Redis {
        const client = this.redisClients.get(namespace);

        if (!client) throw new RedisError(`Unable to find the '${parseNamespace(namespace)}' client`);

        return client;
    }
}
