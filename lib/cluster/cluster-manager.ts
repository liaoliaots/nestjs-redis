import { Injectable, Inject } from '@nestjs/common';
import { Cluster } from 'ioredis';
import { RedisError } from 'redis-errors';
import { CLUSTER_CLIENTS, DEFAULT_CLUSTER_NAMESPACE } from './cluster.constants';
import { ClusterClients } from './interfaces';
import { CLIENT_NOT_FOUND } from '@/messages';
import { parseNamespace } from '@/utils';
import { ClientNamespace } from '@/interfaces';

@Injectable()
export class ClusterManager {
    constructor(@Inject(CLUSTER_CLIENTS) private readonly clusterClients: ClusterClients) {}

    /**
     * Gets all cluster clients as a read-only map.
     */
    get clients(): ReadonlyMap<ClientNamespace, Cluster> {
        return this.clusterClients;
    }

    /**
     * Gets cluster client via namespace.
     */
    getClient(namespace: ClientNamespace = DEFAULT_CLUSTER_NAMESPACE): Cluster {
        const client = this.clusterClients.get(namespace);
        if (!client) throw new RedisError(CLIENT_NOT_FOUND(parseNamespace(namespace), false));
        return client;
    }
}
