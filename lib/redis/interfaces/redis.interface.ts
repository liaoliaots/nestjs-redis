import { Redis } from 'ioredis';
import { ClientNamespace } from '../../interfaces';

export type RedisClients = Map<ClientNamespace, Redis>;

export interface RedisClientsService {
    /**
     * Returns all clients.
     */
    clients: ReadonlyMap<ClientNamespace, Redis>;

    /**
     * Gets client via namespace.
     */
    getClient: (namespace: ClientNamespace) => Redis;
}
