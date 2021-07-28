import { Cluster } from 'ioredis';
import { ClientNamespace } from '../../interfaces';

export type ClusterClients = Map<ClientNamespace, Cluster>;

export interface ClusterClientsService {
    /**
     * Returns all clients.
     */
    clients: ReadonlyMap<ClientNamespace, Cluster>;

    /**
     * Gets client via namespace.
     */
    getClient: (namespace: ClientNamespace) => Cluster;
}
