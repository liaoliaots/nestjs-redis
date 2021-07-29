import { Cluster } from 'ioredis';
import { ClientNamespace } from '@/interfaces';

export type ClusterClients = Map<ClientNamespace, Cluster>;

export interface ClusterClientsService {
    /**
     * Returns all cluster clients as a read-only map.
     */
    clients: ReadonlyMap<ClientNamespace, Cluster>;

    /**
     * Gets cluster client via namespace.
     */
    getClient: (namespace: ClientNamespace) => Cluster;
}
