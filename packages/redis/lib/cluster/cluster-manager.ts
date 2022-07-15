import { Injectable, Inject } from '@nestjs/common';
import type { Cluster } from 'ioredis';
import { CLUSTER_CLIENTS, DEFAULT_CLUSTER_NAMESPACE } from './cluster.constants';
import { ClusterClients } from './interfaces';
import { parseNamespace } from '@/utils';
import { ClientNamespace } from '@/interfaces';
import { ClientNotFoundError } from '@/errors';

/**
 * Manager for cluster clients.
 *
 * @public
 */
@Injectable()
export class ClusterManager {
  constructor(@Inject(CLUSTER_CLIENTS) private readonly clusterClients: ClusterClients) {}

  /**
   * Retrieves all cluster clients.
   */
  get clients(): ReadonlyMap<ClientNamespace, Cluster> {
    return this.clusterClients;
  }

  /**
   * Retrieves a cluster client by namespace.
   */
  getClient(namespace: ClientNamespace = DEFAULT_CLUSTER_NAMESPACE): Cluster {
    const client = this.clusterClients.get(namespace);
    if (!client) throw new ClientNotFoundError(parseNamespace(namespace), 'cluster');
    return client;
  }
}
