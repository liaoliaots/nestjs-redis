import { Redis } from 'ioredis';
import { ClientNamespace } from '@/interfaces';

export type RedisClients = Map<ClientNamespace, Redis>;

export interface RedisClientsService {
    /**
     * Returns all redis clients as a read-only map.
     */
    clients: ReadonlyMap<ClientNamespace, Redis>;

    /**
     * Gets redis client via namespace.
     */
    getClient: (namespace: ClientNamespace) => Redis;
}
