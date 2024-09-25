import { Injectable, Inject } from '@nestjs/common';
import type { Cluster } from 'ioredis';
import { CLUSTER_CLIENTS, DEFAULT_CLUSTER } from './cluster.constants';
import { ClusterClients } from './interfaces';
import { parseNamespace } from '@/utils';
import { Namespace } from '@/interfaces';
import { ClientNotFoundError } from '@/errors';

/**
 * Manager for cluster connections.
 */
@Injectable()
export class ClusterService {
  constructor(@Inject(CLUSTER_CLIENTS) private readonly clients: ClusterClients) {}

  /**
   * Retrieves a cluster connection by namespace.
   * However, if the query does not find a connection, it returns ClientNotFoundError: No Connection found error.
   *
   * @param namespace - The namespace
   * @returns A cluster connection
   */
  getOrThrow(namespace: Namespace = DEFAULT_CLUSTER): Cluster {
    const client = this.clients.get(namespace);
    if (!client) throw new ClientNotFoundError(parseNamespace(namespace));
    return client;
  }

  /**
   * Retrieves a cluster connection by namespace, if the query does not find a connection, it returns `null`;
   *
   * @param namespace - The namespace
   * @returns A cluster connection or nil
   */
  getOrNil(namespace: Namespace = DEFAULT_CLUSTER): Cluster | null {
    const client = this.clients.get(namespace);
    if (!client) return null;
    return client;
  }
}
