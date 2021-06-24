import { Injectable, Inject } from '@nestjs/common';
import { Cluster } from 'ioredis';
import { CLUSTER_CLIENTS, DEFAULT_CLUSTER_CLIENT } from './cluster.constants';
import { ClusterClients, ClusterClientsService } from './interfaces';
import { RedisError, CLIENT_NOT_FOUND } from '../errors';
import { parseNamespace } from '../utils';
import { ClientNamespace } from '../interfaces';

@Injectable()
export class ClusterService implements ClusterClientsService {
    constructor(@Inject(CLUSTER_CLIENTS) private readonly redisClients: ClusterClients) {}

    get clients(): ReadonlyMap<ClientNamespace, Cluster> {
        return this.redisClients;
    }

    getClient(namespace: ClientNamespace = DEFAULT_CLUSTER_CLIENT): Cluster {
        const client = this.redisClients.get(namespace);

        if (!client) throw new RedisError(CLIENT_NOT_FOUND(parseNamespace(namespace)));

        return client;
    }
}
