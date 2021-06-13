import { Redis } from 'ioredis';
import { ClientNamespace } from './redis-module-options.interface';

export type RedisClients = Map<ClientNamespace, Redis>;

export interface RedisClientsService {
    /**
     * All clients as a read-only map.
     */
    clients: ReadonlyMap<ClientNamespace, Redis>;

    /**
     * Gets client via namespace.
     */
    getClient: (namespace: ClientNamespace) => Redis;
}

export interface RedisPingCheckOptions {
    /**
     * The namespace of redis client, this client will execute ping check.
     */
    namespace: ClientNamespace;

    /**
     * The amount of time for ping check.
     */
    timeout?: number;
}
