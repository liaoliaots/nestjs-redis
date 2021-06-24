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

export interface ClusterPingCheckOptions {
    /**
     * The namespace of cluster client, this client will execute ping check.
     */
    namespace: ClientNamespace;

    /**
     * The amount of time in ms for ping check.
     */
    timeout?: number;
}
