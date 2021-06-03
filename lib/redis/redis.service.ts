import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENTS, DEFAULT_REDIS_CLIENT } from './redis.constants';
import { RedisClients, RedisClientsService, ClientNamespace } from './interfaces';
import { RedisError } from '../errors/redis.error';
import { parseNamespace } from './common';

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
